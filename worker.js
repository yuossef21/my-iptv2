// Cloudflare Worker - IPTV Proxy
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Range, Accept, Origin',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // Get target URL from query parameter (support both /proxy and root)
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return new Response(JSON.stringify({
        error: 'Missing url parameter',
        usage: 'Add ?url=YOUR_STREAM_URL to the request'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // Fetch from target server
      const headers = new Headers();
      headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      headers.set('Accept', '*/*');
      headers.set('Connection', 'keep-alive');

      // Forward Range header if present
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader) {
        headers.set('Range', rangeHeader);
      }

      const response = await fetch(targetUrl, { headers });

      // Clone response to modify headers
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Range, Accept, Origin');
      newHeaders.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

      const contentType = response.headers.get('content-type') || '';

      // Handle m3u8 playlists - rewrite relative URLs
      if (contentType.includes('mpegurl') || contentType.includes('m3u8')) {
        let text = await response.text();
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

        // Replace relative URLs with proxied URLs
        text = text.replace(/^((?!#|https?:\/\/).+\.(?:m3u8|ts|aac|mp4|fmp4))$/gm, (match) => {
          const absoluteUrl = baseUrl + match;
          return `https://${url.hostname}/proxy?url=${encodeURIComponent(absoluteUrl)}`;
        });

        return new Response(text, {
          status: response.status,
          headers: newHeaders
        });
      }

      // For other content, stream directly
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
}
