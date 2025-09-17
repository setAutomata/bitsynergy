import { createProxyMiddleware } from "http-proxy-middleware";

const ollamaProxy = (req, res, next) => {
  req.assistant = "";
  let messages = "";
  let endpoint = req.path;

  const proxy = createProxyMiddleware({
    target: "http://localhost:11434/api",
    changeOrigin: true,
    logLevel: "debug",
    logger: console,
    timeout: 55000,
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.body) {
          if (endpoint === "/chat") {
            messages = req.body.messages[req.body.messages.length - 2];
          }
          const body = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/x-ndjson");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(body));
          proxyReq.write(body);
        }

        req.on("close", () => {
          console.log("Client closed the connection");
        });
      },

      proxyRes: (proxyRes, req, res) => {
        if (endpoint === "/chat") {
          Object.entries(proxyRes.headers).forEach(([key, value]) => {
            if (key.toLowerCase() !== "transfer-encoding")
              res.setHeader(key, value);
          });
          let buffer = "";
          proxyRes.on("data", (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split("\n");
            buffer = lines.pop();
            for (const line of lines) {
              if (line.trim()) {
                try {
                  req.assistant += JSON.stringify(
                    JSON.parse(line).message?.content
                  )
                    .slice(1, -1)
                    .replace(/\\"/g, '"');
                  req.user = messages;
                } catch (err) {
                  console.error("Error parsing JSON chunk:", err);
                }
              }
            }
          });
        }
        // proxyRes.pipe(res);
        proxyRes.on("end", () => {
          console.log(
            "Ollama stream ended gracefully at ",
            new Date().toLocaleString()
          );
          if (endpoint === "/chat") res.on("finish", () => next());
        });
      },

      error: (err, req, res) => {
        console.error("Proxy error during request to Ollama: ", err);
        res.status(500).json({ error: "Proxy failed to connect to Ollama" });
        next();
      },
    },
  });

  proxy(req, res, next);
};

export default ollamaProxy;
