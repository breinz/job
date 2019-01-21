import config from './config';
import app from './app';
//import socket from "./back/io";

let server = require("http").createServer(app);

server.listen(config.port, "0.0.0.0", () => {
    console.log(`Listening on ${config.port}`)
});