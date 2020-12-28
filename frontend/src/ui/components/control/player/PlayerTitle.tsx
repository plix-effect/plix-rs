import React, {FC} from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(styles => ({
    root: {
        margin: "16px 8px",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    }
}), {classNamePrefix: "PlayerTitleProps"})

interface PlayerTitleProps {
    title: string
}

export const PlayerTitle: FC<PlayerTitleProps> = ({title}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography  variant={"h6"}>
                {title}
            </Typography>
        </div>
    )
}