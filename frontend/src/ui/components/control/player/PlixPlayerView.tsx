import React, {FC, useMemo} from "react";
import {PlayerTitle} from "./PlayerTitle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {PlayerCoverImageBackground} from "./PlayerCoverImageBackground";
import {PlayerCoverImage} from "./PlayerCoverImage";
import {PlayerProgressBar} from "./PlayerProgressBar";
import {IconButton} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import {useServerPlixPlayer} from "../../../use/socket/useServerPlixPlayer";
import {useServerTimeOffset} from "../../../use/socket/useServerTimeOffset";


const useStyles = makeStyles(theme => ({
    root: {
        position: "relative",
        height: "30vh",
        width: "100%",
        borderBottom: "1px solid white"
    },
    container: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
    },
    middleRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    }
}), {classNamePrefix: "PlixPlayerView"})

export const PlixPlayerView: FC = () => {
    const classes = useStyles();
    const {state, play, pause, stop, selectPlix} = useServerPlixPlayer();
    const [offset] = useServerTimeOffset();

    const [playing, changeStatusActionsAllowed, currentTrackName, playingFromTime] = useMemo(() => {
        const playing = state.status === "play";
        const changeStatusActionsAllowed = ["play","pause", "stop"].includes(state.status);

        let currentTrackName = "(No Track)";
        let duration = null;
        if (state.status === "loading") {
            currentTrackName = "(Loading track)"
        } else  if (state.playingObject) {
            currentTrackName = state.playingObject.track.name;
        }

        const playingFromTime = state.playFromTimestamp == null ? null : (state.playFromTimestamp - offset*2);
        console.log("PlayFromTime",playingFromTime, "NOW", performance.now()*1000, "OFFSET", offset);
        console.log("DIFF",performance.now()*1000 - playingFromTime);

        return [playing, changeStatusActionsAllowed, currentTrackName, playingFromTime]
    }, [state, offset])

    return (
        <React.Fragment>
            <div className={classes.root}>
                <PlayerCoverImageBackground/>
                <div className={classes.container}>
                    <PlayerProgressBar duration={state.duration} playingFromTime={playingFromTime} pauseTime={state.pauseTime}/>
                    <div className={classes.middleRow}>
                        <IconButton color={"default"} disabled={!changeStatusActionsAllowed} onClick={playing ? pause : play}>
                            {
                                playing ?
                                    <PauseIcon fontSize="large" />
                                :
                                    <PlayArrowIcon fontSize="large" />
                            }
                        </IconButton>
                        <PlayerCoverImage/>
                        <IconButton color={"default"} disabled={!changeStatusActionsAllowed} onClick={stop}>
                            <StopIcon fontSize="large" />
                        </IconButton>
                    </div>
                    <PlayerTitle title={currentTrackName}/>
                </div>
            </div>
        </React.Fragment>
    )
}