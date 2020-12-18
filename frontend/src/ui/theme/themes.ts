import {createMuiTheme} from "@material-ui/core/styles";

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: { main: '#283593' },
        secondary: { main: '#FF6F00' }
    },
});
const deathTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: { main: '#212121' },
        secondary: { main: '#D50000' }
    },
});
const pinkyDarkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: { main: '#D81B60' },
        secondary: { main: '#0055ff' }
    },
});


const tropicsTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: { main: '#00E676' },
        secondary: { main: '#5D4037' }
    },
});
const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: { main: '#283593' },
        secondary: { main: '#FF6F00' }
    },
});
const pinkyLightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: { main: '#D81B60' },
        secondary: { main: '#01579B' }
    },
});

export const THEMES = {
    "DARK": darkTheme,
    "LIGHT": lightTheme,
    "DEATH": deathTheme,
    "TROPICS": tropicsTheme,
    "PINKY": pinkyLightTheme,
    "PINKY DARK": pinkyDarkTheme,
}

export const DEFAULT_THEME_KEY = Object.keys(THEMES)[0];