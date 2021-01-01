import React, {FC, useEffect, useState} from "react";
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

    const [wsOpen, setWsOpen] = useState(true);

    const [pending, error, wsClient, createNewConnection] = useAsyncRequest(() => {
        return createWSClient(getFullWSHost())
    }, null, [])


    useEffect(() => {
        if (!wsClient) return;
        const listener = () => {
            console.log("CLOSED");
            setWsOpen(false);
        };
        wsClient.on("close", listener);
        return () => {
            wsClient.off("close",listener)
        }
    },[wsClient])

    if (pending || error) {
        if (pending) return (
            <div>Connecting websocket...</div>
        )

        return (
            <div>Connection failed!</div>
        )
    }
    if (wsOpen == false) {
        return (
            <div>
                Connecton lost! Try <a onClick={location.reload} href={" "}>reload page</a>!
            </div>
        )
    }

    return (
        <WSContextProvider value={wsClient}>
            {children}
        </WSContextProvider>
    )
}