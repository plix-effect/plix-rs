import React, {FC, useCallback, useState} from "react";
import {Suspense, useContext} from "react";
import {ThemeProvider} from '@material-ui/core/styles';
import {THEMES} from "../../theme/themes";
import {DrawerContextProvider, DrawerContextValue} from "../../use/useDrawer";
import {MainPage} from "../page/main/MainPage";
import {DefaultPageAppBar} from "./DefaultAppBar";
import {PlixDrawer} from "./PlixDrawer";
import {UIRouter, UIView, pushStateLocationPlugin} from "@uirouter/react";
import {routerStates} from "../../router/states";
import {configRouter} from "../../router/configRouter";
import {WSConnectionComponent} from "./WSConnectionComponent";

const THEME = THEMES["PINKY DARK"]

export const App: FC =  () => {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const switchDrawer = useCallback(() => {
        setDrawerOpen((v) => !v);
    }, [setDrawerOpen])

    const drawerContext: DrawerContextValue = {
        switch: switchDrawer,
        open: drawerOpen,
        setOpen: setDrawerOpen
    }

    return (
        <Suspense fallback="loading">
            <WSConnectionComponent>
                <UIRouter plugins={[pushStateLocationPlugin]} config={configRouter} states={routerStates}>
                    <meta name="theme-color" content={THEME.palette.primary.main} />
                    <meta name="apple-mobile-web-app-status-bar-style" content={THEME.palette.primary.main}/>
                    <ThemeProvider theme={THEME}>
                        <DrawerContextProvider value={drawerContext}>
                            <PlixDrawer/>
                            <UIView/>
                        </DrawerContextProvider>
                    </ThemeProvider>
                </UIRouter>
            </WSConnectionComponent>
        </Suspense>
    )
}