import React from "react";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import UserBlock from "../user-block";
import { useLocation } from 'react-router-dom'


const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    avatar: {
        position: "absolute",
        right: -20
    }
}));


const getLocationName = (path) => {
    if (path === '/') {
        return 'Тарифы'
    } else if (path === '/campaigns') {
        return 'Кампании'
    } else if (path === '/automates') {
        return 'Автоматизации'
    } else if (path === '/parsers') {
        return 'Добавления'
    } else if (path === '/grabbers') {
        return 'Промо-посты'
    } else if (path === '/charts') {
        return 'Чарты'
    } else if (path === '/artists') {
        return 'Артисты'
    } else if (path === '/new_campaign') {
        return 'Новая кампания'
    } else if (path === '/new_parser') {
        return 'Новые добавления'
    } else if (path === '/new_automate') {
        return 'Новая автоматизация'
    } else if (path.indexOf('ads/') !== -1) {
        return 'Объявления'
    } else if (path.indexOf('parser/') !== -1) {
        return 'Аудиозаписи'
    }
}


const TopPanel = (props) => {

    const classes = useStyles();
    const location = useLocation()
    const {open, handleDrawerOpen, user, onBindVk} = props

    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar>

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {[classes.hide]: open})}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap>
                    {getLocationName(location.pathname)}
                </Typography>

                <div className={classes.avatar}>
                    <UserBlock user={user} onBindVk={onBindVk} />
                </div>

            </Toolbar>
        </AppBar>
    )
}


export default TopPanel
