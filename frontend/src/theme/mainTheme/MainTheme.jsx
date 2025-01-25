import { createTheme } from "@mui/material";
import { blue, pink } from "@mui/material/colors";

const MainTheme = createTheme({
    palette: {
        primary: {
            main: "#4f31d0",
        },
        secondary: {
            main: pink[500], 
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, 
                },
                containedPrimary: {
                    backgroundColor: "#4f31d0",
                    color: "#ffffff",
                    '&:hover': {
                        backgroundColor: "#9178fa",
                    },
                },
                containedSecondary: {
                    backgroundColor: pink[500],
                    color: "#ffffff",
                    '&:hover': {
                        backgroundColor: pink[700],
                    },
                },
            },
        },
    },
});

export default MainTheme;
