import express from "express"
import expressWs from "express-ws"
import bodyParser from "body-parser";
import cors from "cors";
import history from "connect-history-api-fallback";
import path from "path";
import WebSocket from "ws";
import {createWSClient} from "./socket/WSClient";


interface RSServerOptions {
    plixFileDirectory?: string
}

export const createRSServer = () => {

    const expressApp = express();
    const expressWsApp = expressWs(expressApp).app;
    expressApp.use(bodyParser.json());
    expressApp.use(cors());

    expressApp.use(history({
        verbose: true
    }))

    expressApp.use(express.static(path.join(__dirname, "web")));

    expressWsApp.ws("/api", (ws, req) => {
        const client = createWSClient(ws);
    });


    return expressWsApp;
}