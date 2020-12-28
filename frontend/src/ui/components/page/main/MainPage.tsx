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
    title: {
        marginBottom: theme.spacing(1.5)
    },
    optionName: {
        fontWeight: "bold"
    }
}), {classNamePrefix: "AboutGamePage"})

export const MainPage: FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <DefaultPageAppBar title={"PLIX RS"}/>
            <Paper  elevation={0} className={classes.paper}>
                <PlixPlayerView/>
                <TrackListView/>
            </Paper>
        </div>
    )
}