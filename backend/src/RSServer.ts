import express from "express"
import expressWs from "express-ws"
import bodyParser from "body-parser";
import cors from "cors";
import history from "connect-history-api-fallback";
import path from "path";
import WebSocket from "ws";
import {createWSClient, IWSClient} from "./socket/WSClient";
import {cli} from "webpack";
import {createPlixFileManager} from "./PlixFileManager";
import {ServerAnswerRequestFilesPacket} from "../../typings/ServerPackets";
import {ClientPacket} from "../../typings/ClientPackets";


interface RSServerOptions {
    plixFileDirectory?: string
}

export const createRSServer = ({plixFileDirectory = path.join(__dirname, "/../", "plix")}: RSServerOptions) => {
    const plixFileManager = createPlixFileManager(plixFileDirectory);
    console.log(plixFileDirectory)
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

        client.on("packet", packet => handlePacket(client, packet))
    });

    const handlePacket = async (ws: IWSClient, packet: ClientPacket) => {
        if (packet._type === "requestFiles") {
            const fileList = await plixFileManager.getFileList();
            const answerPacket: ServerAnswerRequestFilesPacket = {
                _packetId: packet._packetId,
                files: fileList
            }
            ws.send(answerPacket);
        }
    }

    return expressWsApp;
}