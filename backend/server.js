const app = require("./app.js");
const { port } = require("./config.js");

app.listen(port, () => {
  console.log(`Exchange rate API listening on port ${port}`);
});
