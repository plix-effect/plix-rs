import React, {FC, useEffect, useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames"

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        height: "100vh",
        width: "100vw",
        zIndex: 1110,
    },
    goodFileDragging: {
        background: "radial-gradient(circle, rgba(60,60,60,0.623686974789916) 30%, rgba(48,255,91,0.819765406162465) 100%)",
    },
    badFileDragging: {
        background: "radial-gradient(circle, rgba(60,60,60,0.623686974789916) 30%, rgba(255,48,78,1) 100%)",
    }
}), {classNamePrefix: "DragonDropPlixArea"})

export const DragonDropPlixArea = () => {
    const classes = useStyles();
    const rootRef = useRef<HTMLDivElement>();
    const [goodFileDragging, setGoodFileDragging] = useState(false);
    const [badFileDragging, setBadFileDragging] = useState(false);

    const divClasses = classnames(classes.root, {
        [classes.goodFileDragging]: goodFileDragging,
        [classes.badFileDragging]: badFileDragging,
    })

    const clearHighlight = () => {
        setGoodFileDragging(false);
        setBadFileDragging(false);
    }

    useEffect(() => {
        const div = rootRef.current;
        if (!div) return;
        const preventDefaults = (e) => {e.preventDefault(); e.stopPropagation();}

        const dragEnterListener = (e: DragEvent) => {
            preventDefaults(e);
            if (e.dataTransfer.items.length === 0) return;
            const item = e.dataTransfer.items[0];
            if (item.kind === "file") {
                setGoodFileDragging(true);
            } else {
                setBadFileDragging(true);
            }
        }

        const dragLeaveListener = (e: DragEvent) => {
            preventDefaults(e);
            clearHighlight();
        }

        const dragOverListener = (e: DragEvent) => {
            preventDefaults(e);
        }

        const dropListener = (e: DragEvent) => {
            preventDefaults(e);
            clearHighlight();
            if (e.dataTransfer.items.length === 0) return;
            const item = e.dataTransfer.items[0];
            if (item.kind !== "file") return;
            console.log(item);
            return true;
        }

        div.addEventListener("dragenter", dragEnterListener);
        div.addEventListener("dragleave", dragLeaveListener);
        div.addEventListener("dragover", dragOverListener);
        div.addEventListener("drop", dropListener);

    }, [rootRef])

    return (
        <div className={divClasses} ref={rootRef}/>
    )
}