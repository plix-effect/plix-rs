import React, {FC} from "react";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {node} from "webpack";
import {App} from "./App";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "radial-gradient(circle, rgba(60,60,60,1) 0%, rgba(41,39,39,1) 100%)",
        width: "100vw",
        minHeight: "100vh",
    },
    container: {
        width: 450,
        height: 800,
        overflow: "hidden",
        border: "11px black solid",
        borderRadius: 30,
        margin: "auto",
        marginTop: "16"
    },
    frame: {
        width: "100%",
        height: "100%",
        border: "none"
    }
}), {classNamePrefix: "MobilifyContainer"})

export const MobilifyContainer: FC<{rnd: number}> = ({children,rnd}) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = window.innerWidth > 900;

    console.log(`[${rnd}] ${matches}`)

    if (matches) {
        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <iframe className={classes.frame} src={"/"}/>
                </div>
            </div>
        )
    } else {
        return <App/>
    }
}