const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for recommender API
  app.use(
    '/api/recommend',
    createProxyMiddleware({
      target: 'https://recommender-trip-go-api.onrender.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request to:', req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      }
    })
  );

  // Proxy for payment API and other public APIs
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://tripgo-api.onrender.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying tripgo API request to:', req.url);
      },
      onError: (err, req, res) => {
        console.error('Tripgo API Proxy error:', err);
      }
    })
  );
};
