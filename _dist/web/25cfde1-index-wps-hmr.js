self["webpackHotUpdate_plix_effect_rs"]("index",{

/***/ "./frontend/src/ui/components/control/player/PlixPlayerView.tsx":
/*!**********************************************************************!*\
  !*** ./frontend/src/ui/components/control/player/PlixPlayerView.tsx ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlixPlayerView": () => /* binding */ PlixPlayerView
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _PlayerTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PlayerTitle */ "./frontend/src/ui/components/control/player/PlayerTitle.tsx");
/* harmony import */ var _material_ui_core_styles_makeStyles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/styles/makeStyles */ "./node_modules/@material-ui/core/styles/makeStyles.js");
/* harmony import */ var _PlayerCoverImageBackground__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PlayerCoverImageBackground */ "./frontend/src/ui/components/control/player/PlayerCoverImageBackground.tsx");
/* harmony import */ var _PlayerCoverImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PlayerCoverImage */ "./frontend/src/ui/components/control/player/PlayerCoverImage.tsx");
/* harmony import */ var _PlayerProgressBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PlayerProgressBar */ "./frontend/src/ui/components/control/player/PlayerProgressBar.tsx");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/IconButton/IconButton.js");
/* harmony import */ var _material_ui_icons_PlayArrow__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/icons/PlayArrow */ "./node_modules/@material-ui/icons/PlayArrow.js");
/* harmony import */ var _material_ui_icons_Pause__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/icons/Pause */ "./node_modules/@material-ui/icons/Pause.js");
/* harmony import */ var _material_ui_icons_Stop__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/icons/Stop */ "./node_modules/@material-ui/icons/Stop.js");
/* harmony import */ var _use_socket_useServerPlixPlayer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../use/socket/useServerPlixPlayer */ "./frontend/src/ui/use/socket/useServerPlixPlayer.ts");
/* harmony import */ var _use_socket_useServerTimeOffset__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../use/socket/useServerTimeOffset */ "./frontend/src/ui/use/socket/useServerTimeOffset.ts");












const useStyles = (0,_material_ui_core_styles_makeStyles__WEBPACK_IMPORTED_MODULE_7__.default)(theme => ({
    root: {
        position: "relative",
        height: "220px",
        minHeight: "220px",
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
}), { classNamePrefix: "PlixPlayerView" });
const PlixPlayerView = () => {
    const classes = useStyles();
    const { state, play, pause, stop, selectPlix } = (0,_use_socket_useServerPlixPlayer__WEBPACK_IMPORTED_MODULE_5__.useServerPlixPlayer)();
    const [offset] = (0,_use_socket_useServerTimeOffset__WEBPACK_IMPORTED_MODULE_6__.useServerTimeOffset)();
    const [playing, changeStatusActionsAllowed, currentTrackName, playingFromTime] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        const playing = state.status === "play";
        const changeStatusActionsAllowed = ["play", "pause", "stop"].includes(state.status);
        let currentTrackName = "(No Track)";
        let duration = null;
        if (state.status === "loading") {
            currentTrackName = "(Loading track)";
        }
        else if (state.playingObject) {
            currentTrackName = state.playingObject.track.name;
        }
        const playingFromTime = state.playFromTime == null ? null : state.playFromTime + offset;
        return [playing, changeStatusActionsAllowed, currentTrackName, playingFromTime];
    }, [state, offset]);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: classes.root },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PlayerCoverImageBackground__WEBPACK_IMPORTED_MODULE_2__.PlayerCoverImageBackground, { trackName: currentTrackName }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: classes.container },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PlayerProgressBar__WEBPACK_IMPORTED_MODULE_4__.PlayerProgressBar, { playing: playing, duration: state.duration, playingFromTime: playingFromTime, pauseTime: state.pauseTime }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: classes.middleRow },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_8__.default, { color: "default", disabled: !changeStatusActionsAllowed, onClick: playing ? pause : play }, playing ?
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_icons_Pause__WEBPACK_IMPORTED_MODULE_9__.default, { fontSize: "large" })
                        :
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_icons_PlayArrow__WEBPACK_IMPORTED_MODULE_10__.default, { fontSize: "large" })),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PlayerCoverImage__WEBPACK_IMPORTED_MODULE_3__.PlayerCoverImage, { trackName: currentTrackName }),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_8__.default, { color: "default", disabled: !changeStatusActionsAllowed, onClick: stop },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_icons_Stop__WEBPACK_IMPORTED_MODULE_11__.default, { fontSize: "large" }))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PlayerTitle__WEBPACK_IMPORTED_MODULE_1__.PlayerTitle, { title: currentTrackName })))));
};


/***/ }),

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


/***/ })

});
//# sourceMappingURL=25cfde1-index-wps-hmr.js.map