import React, {FC} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DefaultPageAppBar} from "../app/DefaultAppBar";
import {Paper} from "@material-ui/core";

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

    return (
        <div className={classes.root}>
            <DefaultPageAppBar title={"PLIX RS"}/>
            <Paper  elevation={0} className={classes.paper}>
                Hi there
            </Paper>
        </div>
    )
}