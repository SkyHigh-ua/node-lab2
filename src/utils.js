import { parse as parseUrlEncoded } from "querystring";

export async function parseBody(req) {
  let body = "";
  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve());
    req.on("error", (error) => reject(error));
  });

  const contentType = req.headers["content-type"];
  switch (contentType) {
    case "application/json":
      return JSON.parse(body);
    case "application/x-www-form-urlencoded":
      return parseUrlEncoded(body);
    default:
      throw new Error("Content type is not supported")
  }
}
