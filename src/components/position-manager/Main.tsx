import { Box, makeStyles, Tab, Tabs, withStyles } from '@material-ui/core';
import React from 'react';

import { EthereumAddress } from '../../types';
import { Deposit, Mint, Redeem, Withdraw } from './views';

export interface MainProps {
    empAddress: EthereumAddress
}

export const PositionManager: React.FC<MainProps> = () => {
    const [tab, setTab] = React.useState(0);

    const handleTabChange = (event: any, newValue: number) => { // TODO Improve any
        setTab(newValue);
    };

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Tabs
                orientation="vertical"
                value={tab}
                onChange={handleTabChange}
                className={classes.tabs}
                aria-label="Vertical tabs example">
                <StyledTab label="Mint" {...a11yProps(0)} />
                <StyledTab label="Deposit" {...a11yProps(1)} />
                <StyledTab label="Withdraw" {...a11yProps(2)} />
                <StyledTab label="Redeem" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <Mint />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Deposit />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <Withdraw />
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <Redeem />
            </TabPanel>
        </Box>
    );
}

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: "none",
        color: "#e13938",
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        "&:focus": {
            opacity: 1,
            fontWeight: "500",
        },
    },
}))((props: any) => <Tab disableRipple {...props} />);

const a11yProps = (index: any) => {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        height: 250,
        padding: 0,
        paddingTop: "0",
        border: "1px solid black",
        alignItems: "center"
    },
    tabs: {
        textAlign: "center",
        borderRight: `0.1px solid ${theme.palette.divider}`
    },
}));


const TabPanel = (props: any) => { // TODO improve typing

    const { children, value, index, ...other } = props;

    return (
        <Box
            height="100%"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box margin="2em 1em 1em 2em">{children}</Box>}
        </Box>
    );
}
