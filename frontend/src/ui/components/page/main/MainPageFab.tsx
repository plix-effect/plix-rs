import React, {ChangeEvent, FC, useRef, useState} from "react";
import {usePlixFilesControl} from "../../../use/socket/usePlixFiles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fab from "@material-ui/core/Fab";
import PublishIcon from '@material-ui/icons/Publish';
import {useAsyncRequest} from "../../../use/useAsyncRequest";
import useLatestCallback from "../../../use/useLatestCallback";
import {CircularProgress} from "@material-ui/core";
import { green } from '@material-ui/core/colors';

import classnames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles(styles => ({
    root: {
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 10,
    },
    inputElement: {
        display: "none"
    },
    fabProgress: {
        color: styles.palette.secondary.light,
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}), {classNamePrefix: "MainPageFab"})

export const MainPageFab: FC = () => {
    const classes = useStyles();
    const [sendFile] = usePlixFilesControl();
    const inputFileRef = useRef<HTMLInputElement>()

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string>(null);
    const [success, setSuccess] = useState<boolean>(null);

    const sendFileCallback = useLatestCallback(async (name: string, file: ArrayBuffer) => {
        setPending(true);
        const answer = await sendFile(name, file);
        setPending(false);
        if (answer.success) {
            setSuccessButton()
        } else {
            setErrorButton(answer.reason);
        }
    });

    const setErrorButton = (e: string) => {
        setError(e);
        setTimeout(() => {
            setError(null)
        }, 3000);
    }

    const setSuccessButton = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(null)
        }, 3000);
    }

    const buttonClassname = classnames({
        [classes.buttonSuccess]: success,
    });

    const onClickUpload = () => {
        if (pending || error || success) return;
        inputFileRef.current.click();
    }

    const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const file = input.files[0];
        if (!file) return;
        const name = file.name;
        const fileData = await file.arrayBuffer();
        await sendFileCallback(name,fileData);
        input.value = "";
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
            <Fab color="primary" aria-label="add" onClick={onClickUpload} className={buttonClassname}>
                {success ? <CheckIcon/> :<PublishIcon />}
            </Fab>
            {pending && <CircularProgress size={68} className={classes.fabProgress} />}

        </div>
    )
}