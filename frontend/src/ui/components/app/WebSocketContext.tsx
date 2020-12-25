import React, {FC} from "react";
import {WSContextProvider} from "../../use/useWSClient";
import {web} from "webpack";
import {createWSClient} from "../../../api/WSClient";

const getFullWSHost = () => {
    return `ws://${location.host}/api`
}

export const WebSocketContext: FC = ({children}) => {

    const wsClient = createWSClient(getFullWSHost())

    return (
        <WSContextProvider value={wsClient}>
            {children}
        </WSContextProvider>
    )
}