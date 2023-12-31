export function GET(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "You have reached /route1 via GET" }));
}

export function POST(req, res, body) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({ message: "POST request received at /route1", data: body }),
  );
}

export function OPTIONS(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    Allow: "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify({ message: "Allowed methods: GET, POST, OPTIONS (from /route1)" }));
}
