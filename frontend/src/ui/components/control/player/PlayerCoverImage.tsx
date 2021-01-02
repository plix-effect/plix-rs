import React, {FC} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface PlayerCoverImageProps {
    trackName: string
}

const useStyles = makeStyles(theme => ({
    miniature: {
        width: 75,
        height: 75,
        border: "2px solid white",
        borderRadius: "4px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 1,
    }
}), {classNamePrefix: "PlayerCoverImageBackground"});

export const PlayerCoverImage: FC<PlayerCoverImageProps> = ({trackName}) => {
    const classes = useStyles();

    console.log(`url(/cover/${trackName})`)
    return (
        <div className={classes.miniature} style={{backgroundImage: `url("/cover/${trackName}")`}}/>
    )
}