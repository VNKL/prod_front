import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TopPanel from "./top-panel";
import LeftPanel from "./left-panel";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));



const NavigationPanel = (props) => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const {leftPanelListItems, user, onBindVk} = props

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>

            <CssBaseline />

            <TopPanel open={open} handleDrawerOpen={handleDrawerOpen} user={user} onBindVk={onBindVk}/>
            <LeftPanel open={open} handleDrawerClose={handleDrawerClose} items={leftPanelListItems}/>

            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>

        </div>
    );
}


export default NavigationPanel