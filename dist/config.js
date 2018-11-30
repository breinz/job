"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let env = process.env;
exports.default = {
    port: env.PORT || 3000,
    mongoUri: "mongodb://0.0.0.0:27017/games"
};
//# sourceMappingURL=config.js.map