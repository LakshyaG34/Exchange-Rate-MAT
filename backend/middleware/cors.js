function createCorsMiddleware(allowedOrigins) {
  const originSet = new Set(allowedOrigins);

  return function corsMiddleware(request, response, next) {
    const origin = request.get("Origin");
    if (!origin || !originSet.has(origin)) return next();

    response.set("Access-Control-Allow-Origin", origin);
    response.vary("Origin");

    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      response.set("Access-Control-Allow-Headers", "Accept");
      return response.sendStatus(204);
    }

    return next();
  };
}

module.exports = { createCorsMiddleware };
