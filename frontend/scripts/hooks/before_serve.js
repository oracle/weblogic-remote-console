module.exports = function (configObj) {
  // OJET tooling expects a Promise from hooks; returning a plain object causes
  // "TypeError: hook(...).then is not a function". Wrap in a Promise and resolve.
  return new Promise((resolve) => {
    try {
      const { serveOpts } = configObj;
      serveOpts.httpProxy = serveOpts.httpProxy || {};
      // Forward any /api/* request from the OJET dev server to the backend
      serveOpts.httpProxy["/api"] = {
        target: "http://localhost:8012",
        changeOrigin: true,
        secure: false,
        logLevel: "debug"
        // pathRewrite: { "^/api": "/api" } // not needed unless you need to alter the prefix
      };
      // Optional: add more contexts here if your backend uses additional base paths
      // serveOpts.httpProxy["/console"] = { target: "http://localhost:8012", changeOrigin: true, secure: false, logLevel: "debug" };

      // Configure Webpack Dev Server proxy (vdom architecture)
      serveOpts.webpackOptions = serveOpts.webpackOptions || {};
      serveOpts.webpackOptions.devServer = serveOpts.webpackOptions.devServer || {};
      serveOpts.webpackOptions.devServer.proxy = serveOpts.webpackOptions.devServer.proxy || {};
      serveOpts.webpackOptions.devServer.proxy["/api"] = {
        target: "http://localhost:8012",
        changeOrigin: true,
        secure: false
      };

      // Helpful console output
      console.log("[before_serve] Proxy enabled: /api -> http://localhost:8012 (httpProxy + WDS proxy)");

      // Fallback: inject a preMiddleware that proxies /api to backend using Node http
      // This covers cases where WDS options were computed before the hook runs.
      const http = require("http");
      const proxyMiddleware = (req, res, next) => {
        try {
          if (!req || !req.url || !req.method) return next();
          if (!req.url.startsWith("/api")) return next();

          const targetHost = "localhost";
          const targetPort = 8012;

          const options = {
            hostname: targetHost,
            port: targetPort,
            path: req.url,
            method: req.method,
            headers: {
              ...req.headers,
              host: `${targetHost}:${targetPort}`
            }
          };

          const proxyReq = http.request(options, (proxyRes) => {
            // copy status and headers
            res.writeHead(proxyRes.statusCode || 500, proxyRes.headers || {});
            proxyRes.pipe(res, { end: true });
          });

          proxyReq.on("error", (err) => {
            console.error("[before_serve] proxy error:", err?.message || err);
            // still let the dev server try to handle it (will likely 404)
            next();
          });

          // pipe request body
          req.pipe(proxyReq, { end: true });
        } catch (err) {
          console.error("[before_serve] proxy exception:", err);
          next();
        }
      };

      // Attach as preMiddleware so it runs before default static handlers
      if (!Array.isArray(configObj.preMiddleware)) {
        configObj.preMiddleware = [];
      }
      configObj.preMiddleware.push(proxyMiddleware);
      console.log("[before_serve] preMiddleware proxy attached for /api");
    } catch (e) {
      console.error("[before_serve] Failed to apply proxy:", e);
    }
    resolve(configObj);
  });
};
