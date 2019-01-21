"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = require("./app");
let server = require("http").createServer(app_1.default);
server.listen(config_1.default.port, "0.0.0.0", () => {
    console.log(`Listening on ${config_1.default.port}`);
});
//# sourceMappingURL=server.js.map