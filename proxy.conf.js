/** Angular dev-server proxy that forwards /api/* to Heroku
 *  and removes the Origin header to avoid CORS-triggered 500s.
 */
const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: "https://fierce-beach-67482-2c91e337192e.herokuapp.com",
    secure: true,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    onProxyReq(proxyReq) {
      try { proxyReq.removeHeader && proxyReq.removeHeader("origin"); } catch (_) {}
    },
    onProxyRes(proxyRes) {
      // ensure dev-server doesn't inject conflicting CORS headers
      delete proxyRes.headers['access-control-allow-origin'];
    },
    logLevel: "debug"
  }
];
module.exports = PROXY_CONFIG;
