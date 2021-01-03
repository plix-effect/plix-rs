import express from "express"
import expressWs from "express-ws"
import bodyParser from "body-parser";
import cors from "cors";
import fallback from "connect-history-api-fallback";
import path from "path";
import WebSocket from "ws";
import {createWSClient, IWSClient} from "./socket/WSClient";
import {cli} from "webpack";
import {createPlixFileManager, PlixFileManager} from "./PlixFileManager";
import {MPlayerService} from "./music/MPlayerService";
import {PlixPlayer} from "./plix/plix-player/PlixPlayer";
import {
    ClientPacket,
    EventPacket,
    PacketAnswer,
    RequestPacketMap,
    ServerAnswerPacket
} from "../../typings/Packets";


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
    const root = path.join(__dirname, "web");

    expressWsApp.get('/cover/*', async function(req, res) {
        const fileName = decodeURIComponent(req.path.substr(7));
        const coverData = await plixFileManager.getMp3Cover(fileName);
        res.setHeader('content-type', 'image/png');
        if (!coverData) {
            const defaultFileName = fileName.endsWith("json") ? "default_cover_json.png" : "default_cover.jpg"
            res.sendFile(path.join(root, "assets", "image", defaultFileName));
            return ;
        }
        res.send(coverData);
    });

    expressWsApp.ws("/api", (ws, req) => {
        const client = createWSClient(ws);
        connectedClients.push(client);
        client.on("close", () => {
            connectedClients.splice(connectedClients.indexOf(client), 1)
        });
        client.on("packet", async packet => {
            const answer = await handlePacket(client, packet);
            if (answer == null) return;
            client.send(answer);
        })
    });

    const broadcastPacket = (packet: EventPacket) => {
        connectedClients.forEach(client => {
            client.send(packet);
        })
    }

    const broadcastFilesChanged = async () => {
        const files = await plixFileManager.getFileList();
        broadcastPacket({
            "_type": "filesChanged",
            files: files
        })
    }


    const handlePacket = async (ws: IWSClient, packet: ClientPacket): Promise<ServerAnswerPacket> => {
        if (packet._type === "requestFiles") {
            const fileList = await plixFileManager.getFileList();
            return {
                _type: "answer",
                _clientPacketType: "requestFiles",
                _packetId: packet._packetId,
                files: fileList
            }
        }
        else if (packet._type === "selectPlix") {
            const file = packet.file;
            plixPlayer.selectTrack(file);
            return null;
        } else if (packet._type === "changePlayStatus") {
            const status = packet.status;
            if (status === "play") plixPlayer.start();
            else if (status === "pause") plixPlayer.pause();
            else if (status === "stop") plixPlayer.stop();
            return null;
        } else if (packet._type === "playerSeek") {
            const time = packet.time;
            plixPlayer.seek(time);
            return null;
        } else if (packet._type === "requestPlayerState") {
            const state = plixPlayer.getState();
            return{
                _type: "answer",
                _clientPacketType: packet._type,
                _packetId: packet._packetId,
                state: state
            }
        } else if (packet._type === "beginSendFile") {
            return{
                _type: "answer",
                _clientPacketType: packet._type,
                _packetId: packet._packetId,
                allow: false,
                reason: "Not realisation for sending file yet"
            }
        } else if (packet._type === "syncTime") {
            return {
                _type: "answer",
                _packetId: packet._packetId,
                _clientPacketType: packet._type,
                time: process.uptime()*1000
            }
        } else if (packet._type === "uploadFile") {
            const {fileName, file} = packet;
            if (!fileName.endsWith("mp3") && !fileName.endsWith("json")) {
                return {
                    _type: "answer",
                    _packetId: packet._packetId,
                    _clientPacketType: packet._type,
                    success: false,
                    reason: "Only mp3 and json files allowed"
                }
            }
            await plixFileManager.uploadFile(fileName, file as Buffer);
            broadcastFilesChanged();
            return  {
                _type: "answer",
                _packetId: packet._packetId,
                _clientPacketType: packet._type,
                success: true,
            }
        } else if (packet._type === "removeFile") {
            const fileName = packet.fileName;
            try {
                await plixFileManager.removeFile(fileName)
            } catch (e) {
                return {
                    _type: "answer",
                    _packetId: packet._packetId,
                    _clientPacketType: packet._type,
                    success: false,
                    reason: e.toString()
                }
            }
            broadcastFilesChanged();
            return {
                _type: "answer",
                _packetId: packet._packetId,
                _clientPacketType: packet._type,
                success: true,
            }
        } else {
            return null
        }
    }

    plixPlayer.on("state", state => {
        broadcastPacket({
            _type: "playerState",
            state: state
        })
    });

    expressApp.use(express.static(root));
    expressApp.use(fallback({root}));

    return expressWsApp;
}

