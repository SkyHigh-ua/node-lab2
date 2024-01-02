import http from "http";
import { parseBody } from "./utils.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

let routeHandlers;

if (isProduction) {
    routeHandlers = {
        '/': import('./routes/index.js'),
        '/route': import('./routes/route/index.js'),
    };
}

const server = http.createServer(async (req, res) => {
  try {
    const { url, method } = req;
    let route;
    if (url && method) {
      if (isProduction) {
        route = routeHandlers[url];
      } else {
        const routePath = path.join(__dirname, 'routes', url !== '/' ? url : '', 'index.js');
        route = await import(routePath);
      }
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
        res.end(`Route not found: ${error.message}`);
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
