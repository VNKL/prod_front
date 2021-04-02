import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";


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
                <Typography variant='h5'> {text} </Typography>
            </Backdrop>
        </Link>
    );
}


export default NoPermissionsBackdrop
