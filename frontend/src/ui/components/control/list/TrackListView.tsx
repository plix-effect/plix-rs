import React, {FC, useMemo} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText  from "@material-ui/core/ListItemText";
import ListItemIcon  from "@material-ui/core/ListItemIcon";
import Typography  from "@material-ui/core/Typography";
import {usePlixFiles} from "../../../use/socket/usePlixFiles";
import {useServerPlixPlayer, useServerPlixPlayerControl} from "../../../use/socket/useServerPlixPlayer";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

export const TrackListView: FC = () => {

    const [files] = usePlixFiles();
    const {selectPlix, state} = useServerPlixPlayer();

    const currentTrackName = useMemo(() => {
        if (!state.playingObject) return null;
        return state.playingObject.track.name;
    }, [state])

    const filesView = useMemo(() => {
        return files.map((f,i) => {
            const onClick = () => selectPlix(f);
            const selected = currentTrackName == f;
            return (
                <ListItem button key={i+1} onClick={onClick} selected={selected}>
                    <ListItemIcon>
                        {
                            selected ?
                                <PlayArrowIcon/>
                                :
                                <Typography>{i+1}</Typography>
                        }
                    </ListItemIcon>
                    <ListItemText>{f}</ListItemText>
                </ListItem>
            )
        })
    }, [files, currentTrackName])

    return (
        <List component="nav" onClick={() => {}}>
            {filesView}
        </List>
    )
}