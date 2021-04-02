import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';


const LeftPanelListItem = (props) => {

    const {item: {text, icon, link}} = props

    return (
        <Link component={RouterLink} to={link} color='textPrimary' underline='none'>
            <ListItem button>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text}/>
            </ListItem>
        </Link>
    );
}


export default LeftPanelListItem