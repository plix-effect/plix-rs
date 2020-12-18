import {createRSServer} from "./RSServer";

const app = createRSServer()
const port = 8083

// app.get('/', (req, res) => {
//     res.send('Hello World!124')
// })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

console.log("process.platform",process.platform)