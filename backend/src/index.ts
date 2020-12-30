import {createRSServer} from "./RSServer";
import {createPlixFileManager} from "./PlixFileManager";
import {AdafruitService} from "./plix/adafruit";
import {PlixPlayer} from "./plix/plix-player/PlixPlayer";
import {MPlayerService} from "./music/MPlayerService";

const port = 8083

const plixFileManager = createPlixFileManager();
const adafruitService = new AdafruitService({leds: 10});
const plixPlayer = new PlixPlayer(plixFileManager, adafruitService, new MPlayerService());


const app = createRSServer({plixPlayer, plixFileManager})

app.listen(port, () => {
    console.info(`PLIX-RS app listening at http://localhost:${port}`)
})

//
// import {PlixPlayer} from "./plix/plix-player/PlixPlayer";
// import {createPlixFileManager} from "./PlixFileManager";
// import {AdafruitService} from "./plix/adafruit";
// import path from "path";
// import {MPlayerService} from "./music/MPlayerService";
//
// const plixFileManager = createPlixFileManager();
// const adafruitService = new AdafruitService({leds: 10});
// const mplayer = new MPlayerService()
// const plixPlayer = new PlixPlayer(plixFileManager, adafruitService, mplayer);
//
//
// const doTest = async () => {
//     mplayer.startFile(plixFileManager.getFullFilePath("1.mp3"));
//     setTimeout(() => {
//         console.log("STOP")
//         mplayer.stop();
//         setTimeout(() => {
//             console.log("PLAY AGAIN")
//             mplayer.play();
//         }, 1500)
//     }, 1500)
// }
//
// doTest();
