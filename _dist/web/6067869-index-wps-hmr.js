self["webpackHotUpdate_plix_effect_rs"]("index",{

/***/ "./frontend/src/ui/components/page/main/MainPage.tsx":
/*!***********************************************************!*\
  !*** ./frontend/src/ui/components/page/main/MainPage.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainPage": () => /* binding */ MainPage
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _material_ui_core_styles_makeStyles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core/styles/makeStyles */ "./node_modules/@material-ui/core/styles/makeStyles.js");
/* harmony import */ var _app_DefaultAppBar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../app/DefaultAppBar */ "./frontend/src/ui/components/app/DefaultAppBar.tsx");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/Paper/Paper.js");
/* harmony import */ var _control_player_PlixPlayerView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../control/player/PlixPlayerView */ "./frontend/src/ui/components/control/player/PlixPlayerView.tsx");
/* harmony import */ var _control_list_TrackListView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../control/list/TrackListView */ "./frontend/src/ui/components/control/list/TrackListView.tsx");
/* harmony import */ var _MainPageFab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MainPageFab */ "./frontend/src/ui/components/page/main/MainPageFab.tsx");
/* harmony import */ var _use_useDragonDropUploader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../use/useDragonDropUploader */ "./frontend/src/ui/use/useDragonDropUploader.tsx");








const useStyles = (0,_material_ui_core_styles_makeStyles__WEBPACK_IMPORTED_MODULE_6__.default)(theme => ({
    root: {
        width: "100%",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column"
    },
    paper: {
        flex: 1,
        borderRadius: 0
    },
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 56px)",
        overflow: "hidden"
    }
}), { classNamePrefix: "MainPage" });
const MainPage = () => {
    const classes = useStyles();
    const [dragonDropDiv, setDragonDropDiv] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();
    const dragonDropHighlight = (0,_use_useDragonDropUploader__WEBPACK_IMPORTED_MODULE_5__.useDragonDropUploader)(dragonDropDiv);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { ref: setDragonDropDiv, className: classes.root },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_app_DefaultAppBar__WEBPACK_IMPORTED_MODULE_1__.DefaultPageAppBar, { title: "PLIX RS" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_MainPageFab__WEBPACK_IMPORTED_MODULE_4__.MainPageFab, null),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__.default, { elevation: 0, className: classes.paper },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: classes.container },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_control_player_PlixPlayerView__WEBPACK_IMPORTED_MODULE_2__.PlixPlayerView, null),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_control_list_TrackListView__WEBPACK_IMPORTED_MODULE_3__.TrackListView, null)))),
        dragonDropHighlight));
};


/***/ }),

/***/ "./frontend/src/ui/use/useDragonDropUploader.tsx":
/*!*******************************************************!*\
  !*** ./frontend/src/ui/use/useDragonDropUploader.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useDragonDropUploader": () => /* binding */ useDragonDropUploader
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _material_ui_core_styles_makeStyles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles/makeStyles */ "./node_modules/@material-ui/core/styles/makeStyles.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);



const useStyles = (0,_material_ui_core_styles_makeStyles__WEBPACK_IMPORTED_MODULE_2__.default)((theme) => ({
    root: {
        position: "fixed",
        height: "100vh",
        width: "100vw",
        zIndex: 1110,
        pointerEvents: "none",
    },
    goodFileDragging: {
        background: "radial-gradient(circle, rgba(60,60,60,0.623686974789916) 30%, rgba(48,255,91,0.819765406162465) 100%)",
    },
    badFileDragging: {
        background: "radial-gradient(circle, rgba(60,60,60,0.623686974789916) 30%, rgba(255,48,78,1) 100%)",
    }
}), { classNamePrefix: "useDragonDropUploader" });
const allowedFileTypes = ["audio/mpeg", "application/json"];
const useDragonDropUploader = (div) => {
    const [goodFileDragging, setGoodFileDragging] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [badFileDragging, setBadFileDragging] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const classes = useStyles();
    const divClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes.root, {
        [classes.goodFileDragging]: goodFileDragging,
        [classes.badFileDragging]: badFileDragging,
    });
    const clearHighlight = () => {
        setGoodFileDragging(false);
        setBadFileDragging(false);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (!div)
            return;
        const preventDefaults = (e) => { e.preventDefault(); e.stopPropagation(); };
        let dragLevel = 0;
        const dragEnterListener = (e) => {
            preventDefaults(e);
            dragLevel++;
            if (e.dataTransfer.items.length === 0)
                return;
            const item = e.dataTransfer.items[0];
            if (item.kind === "file" && allowedFileTypes.includes(item.type)) {
                setGoodFileDragging(true);
            }
            else {
                setBadFileDragging(true);
            }
        };
        const dragLeaveListener = (e) => {
            preventDefaults(e);
            dragLevel--;
            if (dragLevel == 0) {
                clearHighlight();
            }
        };
        const dragOverListener = (e) => {
            preventDefaults(e);
        };
        const dropListener = (e) => {
            preventDefaults(e);
            clearHighlight();
            dragLevel = 0;
            if (e.dataTransfer.items.length === 0)
                return;
            const item = e.dataTransfer.items[0];
            if (item.kind !== "file")
                return;
            console.log(Object.assign({}, item));
            return true;
        };
        div.addEventListener("dragenter", dragEnterListener);
        div.addEventListener("dragleave", dragLeaveListener);
        div.addEventListener("dragover", dragOverListener);
        div.addEventListener("drop", dropListener);
        return () => {
            div.removeEventListener("dragenter", dragEnterListener);
            div.removeEventListener("dragleave", dragLeaveListener);
            div.removeEventListener("dragover", dragOverListener);
            div.removeEventListener("drop", dropListener);
        };
    }, [div]);
    const highlight = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: divClasses }));
    }, [divClasses]);
    return highlight;
};


/***/ })

});
//# sourceMappingURL=6067869-index-wps-hmr.js.map