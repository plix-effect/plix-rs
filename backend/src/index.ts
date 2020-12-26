// import {createRSServer} from "./RSServer";
// import {createPlixFileManager} from "./PlixFileManager";
// import {AdafruitService} from "./plix/adafruit";
// import {PlixPlayer} from "./plix/plix-player/PlixPlayer";
//
// const port = 8083
//
// const plixFileManager = createPlixFileManager();
// const adafruitService = new AdafruitService({leds: 10});
// const plixPlayer = new PlixPlayer(plixFileManager, adafruitService);
//
//
// const app = createRSServer({plixPlayer, plixFileManager})
//
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
//
// console.log("process.platform",process.platform)


import {PlixPlayer} from "./plix/plix-player/PlixPlayer";
import {createPlixFileManager} from "./PlixFileManager";
import {AdafruitService} from "./plix/adafruit";
import path from "path";
import {NodeMPlayerService} from "./music/NodeMPlayerService";

const plixFileManager = createPlixFileManager();
const adafruitService = new AdafruitService({leds: 10});
const plixPlayer = new PlixPlayer(plixFileManager, adafruitService, new NodeMPlayerService());

const doTest = async () => {
    await plixPlayer.selectTrack("1.mp3")
    plixPlayer.start();
    plixPlayer.setVolume(0);
}

doTest();
