import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles(() => ({
    userMenu: {
        color: 'white'
    }
}));


const logOut = () => {
    localStorage.removeItem('token');
    window.location.reload()
}


const UserMenu = (props) => {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const {user, onBindVk} = props

    const bind_vk = !user.hasToken? <MenuItem onClick={onBindVk}>Привязать ВК</MenuItem> : null

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <div>

            <Button className={classes.userMenu}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
            >
                <Avatar alt={user.username} src={user.avaUrl} />
            </Button>

            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {bind_vk}
                <MenuItem onClick={logOut}>Выйти</MenuItem>
            </Menu>

        </div>
    );
}

export default UserMenu