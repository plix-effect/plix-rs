import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {FC} from "react";
import {useDrawerControl} from "../../use/useDrawer";

type IDefaultPageAppBarProps = {
    title?: string
}

const useStyles = makeStyles({
    title: {
        flexGrow: 1
    }
}, {classNamePrefix: "DefaultPageAppBar"});

export const DefaultPageAppBar: FC<IDefaultPageAppBarProps> = ({title}) => {
    const [openDrawer, toggleDrawer] = useDrawerControl();
    const classes = useStyles();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <AppBar position="sticky">
            <Toolbar variant={isXS ? "regular" : "dense"}>
                <IconButton edge="start" color={"inherit"} onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={`${classes.title} noselect`}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}