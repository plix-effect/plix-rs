import React, {useContext} from "react";
import {IWSClient} from "../../api/WSClient";



const WSContext = React.createContext<IWSClient>(null);
export const WSContextProvider = WSContext.Provider;

export const useWSClient = () => {
    const ws = useContext(WSContext);
    return ws;
}