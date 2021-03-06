import React, {FC} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface PlayerCoverImageBackgroundProps {
    trackName: string
}

const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    blurImage: {
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(5px)",
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    },
}), {classNamePrefix: "PlayerCoverImageBackground"});

export const PlayerCoverImageBackground: FC<PlayerCoverImageBackgroundProps> = ({trackName}) => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <div className={classes.blurImage} style={{backgroundImage: `url("/cover/${trackName}")`}}/>
        </div>
    )
}