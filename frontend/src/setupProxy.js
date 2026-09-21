const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Chrome DevTools "Automatic Workspace Folders" probe.
  // Returning a 200 here removes the 404 + CSP console noise on localhost.
  app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.type("application/json").send(
      JSON.stringify({
        workspace: {
          root: __dirname.replace(/\\/g, "/").replace(/\/src$/, ""),
          uuid: "b3f1c2d4-5e6a-47b8-9c0d-1e2f3a4b5c6d",
        },
      })
    );
  });

  // Backend API proxy (all client calls are under /api/v1).
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
