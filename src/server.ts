import config from './config';
import app from './app';
import { Server } from 'http';
//import socket from "./back/io";

let server = require("http").createServer(app);


server.listen(config.port, "0.0.0.0", () => {
    console.log(server.address());
    console.log(`Listening on ${config.port}`)
});