import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        height: 250,
        padding: 0,
        paddingTop: "0",
        alignItems: "center"
    },
    tabs: {
        textAlign: "center",
        borderRight: `0.1px solid ${theme.palette.divider}`
    },
}));
