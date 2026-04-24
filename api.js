class XtreamAPI {
    constructor() {
        this.session = JSON.parse(localStorage.getItem('iptv_session'));
    }

    buildUrl(action, extraParams = '') {
        // تحويل HTTP إلى HTTPS تلقائياً
        const serverUrl = this.session.url.replace('http://', 'https://');
        const targetUrl = `${serverUrl}/player_api.php?username=${this.session.username}&password=${this.session.password}&action=${action}${extraParams}`;
        return targetUrl;
    }

    // رابط مباشر بدون بروكسي للستريم (أسرع وأكثر استقراراً)
    getStreamUrl(type, streamId, extension = 'm3u8') {
        // تحويل HTTP إلى HTTPS تلقائياً
        const serverUrl = this.session.url.replace('http://', 'https://');
        if (type === 'live') {
            return `${serverUrl}/live/${this.session.username}/${this.session.password}/${streamId}.${extension}`;
        } else if (type === 'series') {
            return `${serverUrl}/series/${this.session.username}/${this.session.password}/${streamId}.${extension}`;
        } else {
            return `${serverUrl}/movie/${this.session.username}/${this.session.password}/${streamId}.${extension}`;
        }
    }

    // رابط بروكسي للستريم (للحالات التي تحتاج CORS bypass)
    getProxiedStreamUrl(type, streamId, extension = 'm3u8') {
        const directUrl = this.getStreamUrl(type, streamId, extension);
        return directUrl;
    }

    async fetchAPI(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    async authenticate(url, user, pass) {
        // تحويل HTTP إلى HTTPS تلقائياً
        const serverUrl = url.replace('http://', 'https://');
        const targetUrl = `${serverUrl}/player_api.php?username=${user}&password=${pass}`;
        return await this.fetchAPI(targetUrl);
    }

    async getCategories(type) {
        let action = type === 'live' ? 'get_live_categories' : (type === 'movies' ? 'get_vod_categories' : 'get_series_categories');
        return await this.fetchAPI(this.buildUrl(action));
    }

    async getStreams(type, categoryId) {
        let action = type === 'live' ? 'get_live_streams' : (type === 'movies' ? 'get_vod_streams' : 'get_series');
        return await this.fetchAPI(this.buildUrl(action, `&category_id=${categoryId}`));
    }

    async getAllStreams(type) {
        let action = type === 'live' ? 'get_live_streams' : (type === 'movies' ? 'get_vod_streams' : 'get_series');
        return await this.fetchAPI(this.buildUrl(action));
    }

    async getSeriesInfo(seriesId) {
        return await this.fetchAPI(this.buildUrl('get_series_info', `&series_id=${seriesId}`));
    }
}