import React, {ChangeEvent, FC, useRef} from "react";
import {usePlixFilesControl} from "../../../use/socket/usePlixFiles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fab from "@material-ui/core/Fab";
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles(styles => ({
    root: {
        position: "fixed",
        bottom: 20,
        right: 20
    },
    inputElement: {
        display: "none"
    }
}), {classNamePrefix: "MainPageFab"})

export const MainPageFab: FC = () => {
    const classes = useStyles();
    const [sendFile] = usePlixFilesControl();
    const inputFileRef = useRef<HTMLInputElement>()

    const onClickUpload = () => {
        inputFileRef.current.click();
    }

    const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        const name = file.name;
        const fileData = await file.arrayBuffer();
        console.log("SENDING",name);
        sendFile(name,fileData);
    }

    return (
        <div className={classes.root}>
            <input
                ref={inputFileRef}
                type="file"
                name="name"
                className={classes.inputElement}
                onChange={onFileSelected}
                accept=".mp3, .json"
            />
            <Fab color="primary" aria-label="add" onClick={onClickUpload}>
                <PublishIcon />
            </Fab>
        </div>
    )
}