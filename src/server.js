import http from "http";
import { parseBody } from "./utils.js";
import path from "path";

const server = http.createServer(async (req, res) => {
  try {
    const { url, method } = req;
    if (url && method) {
      const routePath = `./routes${url !== '/' ? url : ''}/index.js`.replace(path.sep, "/");
      const route = await import(routePath);
      if (route[method]) {
        const body = await parseBody(req);
        route[method](req, res, body);
      } else {
        throw new Error("Method not supported");
      }
    } else {
      throw new Error("No URL");
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.code === 'ERR_MODULE_NOT_FOUND') {
        res.writeHead(404);
        res.end("Route not found");
      } else {
          res.writeHead(500);
          res.end(`Error: ${error.message}`);
      }
    } else {
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  }
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  console.log("Shutting down the server...");
  server.close(() => {
    console.log("Server shut down.");
  });
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
