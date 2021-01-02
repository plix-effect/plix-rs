import React, {FC, useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DefaultPageAppBar} from "../../app/DefaultAppBar";
import {Paper} from "@material-ui/core";
import {usePlixFiles} from "../../../use/socket/usePlixFiles";
import {useServerPlixPlayer} from "../../../use/socket/useServerPlixPlayer";
import Typography from "@material-ui/core/Typography";
import {PlixFileSelector} from "../../control/PlixFileSelector";
import Button from "@material-ui/core/Button";
import {PlixPlayerView} from "../../control/player/PlixPlayerView";
import {TrackListView} from "../../control/list/TrackListView";
import {MainPageFab} from "./MainPageFab";
import {DragonDropPlixArea} from "./DragonDropPlixArea";
import {useDragonDropUploader} from "../../../use/useDragonDropUploader";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column"
    },
    paper: {
        flex: 1,
        borderRadius: 0
    },
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 56px)",
        overflow: "hidden"
    }
}), {classNamePrefix: "MainPage"})

export const MainPage: FC = () => {
    const classes = useStyles();
    const [dragonDropDiv,setDragonDropDiv] = useState<HTMLDivElement>();
    const dragonDropHighlight = useDragonDropUploader(dragonDropDiv);

    return (
        <>
            <div ref={setDragonDropDiv} className={classes.root}>
                <DefaultPageAppBar title={"PLIX RS"}/>
                <MainPageFab/>
                <Paper  elevation={0} className={classes.paper}>
                    <div className={classes.container}>
                        <PlixPlayerView/>
                        <TrackListView/>
                    </div>
                </Paper>
            </div>
            {dragonDropHighlight}
        </>
    )
}