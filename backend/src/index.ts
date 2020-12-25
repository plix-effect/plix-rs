// import {createRSServer} from "./RSServer";
//
// const app = createRSServer({})
// const port = 8083
//
// // app.get('/', (req, res) => {
// //     res.send('Hello World!124')
// // })
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

const fileManager = createPlixFileManager(path.join(__dirname, "/../", "plix"));
const adafruitService = new AdafruitService({leds: 10});

const player = new PlixPlayer(fileManager, adafruitService);

const doTest = async () => {
    await player.selectTrack("1.mp3")
    player.start();
    player.setVolume(0);
}

doTest();
