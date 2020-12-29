import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import {useServerTimeOffset} from "../../../use/socket/useServerTimeOffset";
import {Slider, Typography} from "@material-ui/core";
import useLatestCallback from "../../../use/useLatestCallback";
import {BigSlider, BigWhiteSlider} from "../BigSlider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    slider: {
        flex: 1
    },
    timeMarker: {
        marginLeft: 12,
        marginRight: 12
    }
}), {classNamePrefix: "PlayerProgressBar"})

interface PlayerProgressBarProps {
    duration?: number
    playingFromTime?: number,
    pauseTime?: number,
    playing: boolean
}

const millisToMinutesAndSeconds = (millis) => {
    if (millis == null) return "0:00";
    var minutes = Math.floor(millis / 60000);
    var seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
}

export const PlayerProgressBar: FC<PlayerProgressBarProps> = ({duration, playingFromTime, pauseTime, playing}) => {
    const classes = useStyles();

    const calcCurTime = useLatestCallback(() => {
        if (pauseTime != null) return pauseTime
        if (playingFromTime == null) return null;
        const val = performance.now() - playingFromTime;
        if (val > duration) return duration
        return val;
    })

    const beautyDuration = useMemo(() => {
        return millisToMinutesAndSeconds(duration);
    }, [duration])

    const [curTime, setCurTime] = useState(0);

    useEffect(() => {
        const time = calcCurTime();
        setCurTime(time);
    }, [playingFromTime])

    useEffect(() => {
        if (playingFromTime == null || !playing) return;
        const intervalId = setInterval(() => {
            const time = calcCurTime();
            console.log("SET CUR TIME", time);
            setCurTime(time);
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [setCurTime, playingFromTime, pauseTime, playing])


    const sliderView = (curTime == null || duration == null) ?
        (
            <BigWhiteSlider key={"slider_disabled"}
                defaultValue={0}
                onChange={() => {}}
                className={classes.slider}
                disabled
            />
        )
    :
        (
            <BigWhiteSlider key={"slider_controlled"}
                value={curTime || 0}
                onChange={() => {}}
                className={classes.slider}
                min={0}
                max={duration}
            />
        )

    return (
        <div className={classes.root}>
            <Typography className={classes.timeMarker}>{millisToMinutesAndSeconds(curTime)}</Typography>
            {sliderView}
            <Typography className={classes.timeMarker}>{beautyDuration}</Typography>
        </div>
    )
}