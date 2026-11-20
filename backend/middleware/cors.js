function corsMiddleware(request, response, next) {
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Accept, Content-Type");
    return response.sendStatus(204);
  }

  return next();
}

module.exports = corsMiddleware;
