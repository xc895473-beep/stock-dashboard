/**
 * Cloudflare Workers - TWSE API Proxy
 * 部署方法: wrangler deploy
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 獲取目標 URL
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // 檢查是否為允許的域名
    const allowedHosts = ['openapi.twse.com.tw'];
    const urlObj = new URL(targetUrl);
    if (!allowedHosts.includes(urlObj.hostname)) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    } catch (error) {
      return new Response(error.message, { status: 500 });
    }
  },
};
