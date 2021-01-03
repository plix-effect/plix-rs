import React, {useEffect, useMemo, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import {useAsyncRequest} from "./useAsyncRequest";
import useLatestCallback from "./useLatestCallback";
import {usePlixFilesControl} from "./socket/usePlixFiles";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        height: "100vh",
        width: "100vw",
        zIndex: 1110,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        transition: "background-color linear 0.2s"
    },
    goodFileDragging: {
        background: "radial-gradient(circle, rgba(60,60,60,0.623686974789916) 30%, rgba(48,255,91,0.819765406162465) 100%)",
    },
    badFileDragging: {
        background: "radial-gradient(circle, rgba(60,60,60,0.623686974789916) 30%, rgba(255,48,78,1) 100%)",
    },
    blockClicks: {
        pointerEvents: "all",
    },
    pending: {
        backgroundColor: "#000000ba",
    },
    success: {
        backgroundColor: "#00fe2e8a",
    },
    error: {
        backgroundColor: "#ff030073",
    }
}), {classNamePrefix: "useDragonDropUploader"});

const allowedFileTypes = ["audio/mpeg", "application/json"];

export const useDragonDropUploader = (div: HTMLElement) => {
    const [goodFileDragging, setGoodFileDragging] = useState(false);
    const [badFileDragging, setBadFileDragging] = useState(false);
    const classes = useStyles();
    const [sendFile] = usePlixFilesControl();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string>(null);
    const [success, setSuccess] = useState<boolean>(null);

    const sendFileCallback = useLatestCallback(async (name: string, file: ArrayBuffer) => {
        setPending(true);
        const answer = await sendFile(name, file);
        setPending(false);
        if (answer.success) {
            setSuccessForWhile()
        } else {
            setErrorForWhile(answer.reason);
        }
    });

    const setErrorForWhile = (e: string) => {
        setError(e);
        setTimeout(() => {
            setError(null)
        }, 2500);
    }

    const setSuccessForWhile = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(null)
        }, 1000);
    }

    const divClasses = classnames(classes.root, {
        [classes.goodFileDragging]: goodFileDragging,
        [classes.badFileDragging]: badFileDragging,
        [classes.success]: success,
        [classes.error]: error,
        [classes.pending] : pending
    })

    const clearHighlight = () => {
        setGoodFileDragging(false);
        setBadFileDragging(false);
    }

    useEffect(() => {
        if (!div) return;
        const preventDefaults = (e) => {e.preventDefault(); e.stopPropagation();}
        let dragLevel = 0;

        const dragEnterListener = (e: DragEvent) => {
            preventDefaults(e);
            dragLevel++;
            if (e.dataTransfer.items.length === 0) return;
            const item = e.dataTransfer.items[0];
            if (item.kind === "file" && allowedFileTypes.includes(item.type)) {
                setGoodFileDragging(true);
            } else {
                setBadFileDragging(true);
            }
        }

        const dragLeaveListener = (e: DragEvent) => {
            preventDefaults(e);
            dragLevel--;
            if (dragLevel == 0) {
                clearHighlight();
            }
        }

        const dragOverListener = (e: DragEvent) => {
            preventDefaults(e);
        }

        const dropListener = async (e: DragEvent) => {
            preventDefaults(e);
            clearHighlight();
            dragLevel = 0;
            if (e.dataTransfer.items.length === 0) return;
            const item = e.dataTransfer.items[0];
            if (item.kind !== "file" || !allowedFileTypes.includes(item.type) ) return;
            const file = item.getAsFile();
            const data = await file.arrayBuffer();
            sendFileCallback(file.name, data);
        }

        div.addEventListener("dragenter", dragEnterListener);
        div.addEventListener("dragleave", dragLeaveListener);
        div.addEventListener("dragover", dragOverListener);
        div.addEventListener("drop", dropListener);

        return () => {
            div.removeEventListener("dragenter", dragEnterListener);
            div.removeEventListener("dragleave", dragLeaveListener);
            div.removeEventListener("dragover", dragOverListener);
            div.removeEventListener("drop", dropListener);
        }
    }, [div])


    const highlight = useMemo(() => {
        return (
            <div className={divClasses}>
                <span>
                    {
                        pending ? "Uploading..." : null
                    }
                    {
                        success ? "Success!" : null
                    }
                    {
                        error ? "Error occurred: "+error : null
                    }
                </span>
            </div>
        )
    }, [divClasses, pending, error, success]);

    return highlight;
}