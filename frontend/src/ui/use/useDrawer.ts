import React, {useContext} from "react";

export interface DrawerContextValue {
    open: boolean
    setOpen: (v: boolean|((v: boolean) => boolean)) => void
    switch: () => void;
}

const DrawerContext = React.createContext<DrawerContextValue>(null);
export const DrawerContextProvider = DrawerContext.Provider;

export const useDrawer = (): [DrawerContextValue["open"], DrawerContextValue["setOpen"], DrawerContextValue["switch"]] => {
    const ctx = useContext(DrawerContext);
    return [ctx.open, ctx.setOpen, ctx.switch];
}

export const useDrawerControl = (): [DrawerContextValue["setOpen"], DrawerContextValue["switch"]] => {
    const ctx = useContext(DrawerContext);
    return [ctx.setOpen, ctx.switch]
}

