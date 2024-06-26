const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://127.0.0.1:8080', 
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
      secure: false 
     }),
     createProxyMiddleware('/textures', {
      target: 'http://127.0.0.1:8080', 
      changeOrigin: true,
      pathRewrite: { '^/textures': '/textures' },
      secure: false 
     }),
   )
}