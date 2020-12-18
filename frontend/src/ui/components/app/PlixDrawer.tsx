import * as React from "react"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {useCallback} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import {UISref} from "@uirouter/react";
import {useGlobalState} from "../../use/usaGlobalState";
import {useDrawer} from "../../use/useDrawer";

export const DRAWER_STATE_SYMBOL = Symbol("DRAWER_STATE_SYMBOL")

const useStyles = makeStyles({
    box: {
        height: "100vh",
        minWidth: "50vw",
        display: "flex",
        flexDirection: "column"
    },
    mainList: {
        flex: 1
    }
})

export const PlixDrawer = () => {
    const [open, setOpen, toggleDrawer] = useDrawer();
    const classes = useStyles();

    const toggleFullscreen = useCallback(() => {
         if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
             document.documentElement.requestFullscreen()
         }
    },[]);

    return (
        <SwipeableDrawer
            open={open}
            anchor={"left"}
            onOpen={toggleDrawer}
            onClose={toggleDrawer}
        >
            <Box className={classes.box}>
                <List onClick={toggleDrawer} className={classes.mainList}>
                    <UISref to={"main"}>
                        <ListItem button>
                            <ListItemText primary={"Main"} />
                        </ListItem>
                    </UISref>
                    <UISref to={"room"}>
                        <ListItem button>
                            <ListItemText primary={"Playlists"} />
                        </ListItem>
                    </UISref>
                    <UISref to={"settings"}>
                        <ListItem button>
                            <ListItemText primary={"Settings"} />
                        </ListItem>
                    </UISref>
                    <ListItem button onClick={toggleFullscreen}>
                        <ListItemText primary={"Fullscreen"} />
                    </ListItem>
                </List>
                <List onClick={toggleDrawer}>
                    <UISref to={"about-project"}>
                        <ListItem button>
                            <ListItemText primary={"About project"} />
                        </ListItem>
                    </UISref>
                </List>
            </Box>

        </SwipeableDrawer>
    )
};