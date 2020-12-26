import express from "express"
import expressWs from "express-ws"
import bodyParser from "body-parser";
import cors from "cors";
import history from "connect-history-api-fallback";
import path from "path";
import WebSocket from "ws";
import {createWSClient, IWSClient} from "./socket/WSClient";
import {cli} from "webpack";
import {createPlixFileManager, PlixFileManager} from "./PlixFileManager";
import {ServerAnswerRequestFilesPacket, ServerPacket} from "../../typings/ServerPackets";
import {ClientPacket} from "../../typings/ClientPackets";
import {MPlayerService} from "./music/MPlayerService";
import {PlixPlayer} from "./plix/plix-player/PlixPlayer";


interface RSServerOptions {
    plixFileManager: PlixFileManager
    plixPlayer: PlixPlayer
}

const connectedClients: IWSClient[] = [];

export const createRSServer = ({plixFileManager, plixPlayer}: RSServerOptions) => {
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
        connectedClients.push(client);
        client.on("close", () => {
            connectedClients.splice(connectedClients.indexOf(client), 1)
        });
        client.on("packet", packet => handlePacket(client, packet))
    });

    const broadcastPacket = (packet: ServerPacket) => {
        connectedClients.forEach(client => {
            client.send(packet);
        })
    }

    const handlePacket = async (ws: IWSClient, packet: ClientPacket) => {
        if (packet._type === "requestFiles") {
            const fileList = await plixFileManager.getFileList();
            const answerPacket: ServerAnswerRequestFilesPacket = {
                _type: "answer",
                _clientPacketType: "requestFiles",
                _packetId: packet._packetId,
                files: fileList
            }
            ws.send(answerPacket);
        } else if (packet._type === "selectPlix") {
            const file = packet.fileName;
            plixPlayer.selectTrack(file);
        } else if (packet._type === "changePlayStatus") {
            const status = packet.status;
            if (status === "play") plixPlayer.start();
            else if (status === "pause") plixPlayer.pause();
            else if (status === "stop") plixPlayer.stop();
        } else if (packet._type === "playerSeek") {
            const time = packet.time;
            plixPlayer.seek(time);
        } else if (packet._type === "requestPlayerState") {
            const state = plixPlayer.getState();
            ws.send({
                _type: "answer",
                _clientPacketType: packet._type,
                _packetId: packet._packetId,
                state: state
            })
        } else if (packet._type === "beginSendFile") {
            ws.send({
                _type: "answer",
                _clientPacketType: packet._type,
                _packetId: packet._packetId,
                allow: false,
                reason: "Not realisation for sending file yet"
            })
        }
    }

    plixPlayer.on("state", state => {
        broadcastPacket({
            _type: "playerState",
            state: state
        })
    })

    return expressWsApp;
}

