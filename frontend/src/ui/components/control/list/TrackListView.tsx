import React, {FC, useMemo} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText  from "@material-ui/core/ListItemText";
import ListItemIcon  from "@material-ui/core/ListItemIcon";
import Typography  from "@material-ui/core/Typography";
import {usePlixFiles, usePlixFilesControl} from "../../../use/socket/usePlixFiles";
import {useServerPlixPlayer, useServerPlixPlayerControl} from "../../../use/socket/useServerPlixPlayer";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import {IconButton} from "@material-ui/core";

export const TrackListView: FC = () => {

    const [files] = usePlixFiles();
    const [uploadFile, removeFile] = usePlixFilesControl();
    const {selectPlix, state} = useServerPlixPlayer();

    const onClickRemoveFile = (file: string) => {
        const confirmed = confirm(`Are you sure you want delete file: ${file}?`);
        if (!confirmed) return;
        removeFile(file);
    }

    const currentTrackName = useMemo(() => {
        if (!state.playingObject) return null;
        return state.playingObject.track.name;
    }, [state])

    const filesView = useMemo(() => {
        return files.map((f,i) => {
            const onClickItem = () => selectPlix(f);
            const onClickRemove = (e) => {
                e.stopPropagation();
                onClickRemoveFile(f);
            }
            const selected = currentTrackName == f;
            return (
                <ListItem button key={i+1} onClick={onClickItem} selected={selected}>
                    <ListItemIcon>
                        {
                            selected ?
                                <PlayArrowIcon/>
                                :
                                <Typography style={{marginLeft: 8}}>{i+1}</Typography>
                        }
                    </ListItemIcon>
                    <ListItemText>{f}</ListItemText>
                    <IconButton edge={"end"} onClick={onClickRemove}>
                        <DeleteIcon/>
                    </IconButton>
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