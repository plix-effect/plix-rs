import React, {FC} from "react";
import {WSContextProvider} from "../../use/useWSClient";
import {web} from "webpack";
import {createWSClient} from "../../../api/WSClient";
import {useAsyncRequest} from "../../use/useAsyncRequest";

const getFullWSHost = () => {
    let host = "$Webpack_WS_Host";
    if (host === "null") host = location.host;
    return `ws://${host}/api`
}

export const WSConnectionComponent: FC = ({children}) => {

    const [pending, error, wsClient, createNewConnection] = useAsyncRequest(() => {
        return createWSClient(getFullWSHost())
    }, null, [])

    if (pending || error) {
        if (pending) return (
            <div>Connecting websocket...</div>
        )

        return (
            <div>Connection failed!</div>
        )
    }

    return (
        <WSContextProvider value={wsClient}>
            {children}
        </WSContextProvider>
    )
}