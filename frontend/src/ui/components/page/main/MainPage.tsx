import React, {FC, useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DefaultPageAppBar} from "../../app/DefaultAppBar";
import {Paper} from "@material-ui/core";
import {usePlixFiles} from "../../../use/socket/usePlixFiles";
import {useServerPlixPlayer} from "../../../use/socket/useServerPlixPlayer";
import Typography from "@material-ui/core/Typography";
import {PlixFileSelector} from "../../control/PlixFileSelector";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column"
    },
    paper: {
        flex: 1
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
    const {state, play, pause, stop, selectPlix} = useServerPlixPlayer();
    const [currentFile, setCurrentFile] = useState(null);

    const onChangeFile = (file) => {
        selectPlix(file);
        setCurrentFile(file);
    }

    return (
        <div className={classes.root}>
            <DefaultPageAppBar title={"PLIX RS"}/>
            <Paper  elevation={0} className={classes.paper}>
                <Typography>
                    <span>Current file: ${currentFile}</span>
                </Typography>
                <PlixFileSelector file={currentFile} onChange={onChangeFile}/>
                <Typography>
                    <span>State: {JSON.stringify(state)}</span>
                </Typography>
                <Button variant="outlined" onClick={play}>Play</Button>
                <Button variant="outlined" onClick={pause}>Pause</Button>
                <Button variant="outlined" onClick={stop}>Stop</Button>
            </Paper>
        </div>
    )
}