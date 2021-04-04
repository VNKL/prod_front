import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import MuiAlert from "@material-ui/lab/Alert";


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const NoPermissionsBackdrop = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const {text} = props

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Link component={RouterLink} to={`/`} underline='none' >
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <MuiAlert elevation={6} variant="filled" severity="error" >
                    {text}
                </MuiAlert>
            </Backdrop>
        </Link>
    );
}


export default NoPermissionsBackdrop
