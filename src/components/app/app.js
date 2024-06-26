import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import jwt from 'jsonwebtoken'
import NavigationPanel from "../navigaton-panel";
import LoginPage from "../pages/login-page";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import SettingsPowerIcon from '@material-ui/icons/SettingsPower';
import SaveIcon from '@material-ui/icons/Save';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import {MuiThemeProvider} from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Pages from "../pages";
import { ruRU } from '@material-ui/core/locale';
import ApiService from "../../services/api-service";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import HeadsetIcon from '@material-ui/icons/Headset';


const leftPanelListItems = [
    {text: 'Кампании', icon: <PlaylistAddCheckIcon />, link: '/campaigns'},
    {text: 'Автоматизации', icon: <SettingsPowerIcon />, link: '/automates'},
    {text: 'Добавления', icon: <SaveIcon />, link: '/parsers'},
    {text: 'Что еще слушают', icon: <HeadsetIcon />, link: '/listeners'},
    {text: 'Похожие артисты', icon: <EmojiPeopleIcon />, link: '/relateds'},
    {text: 'Анализ артистов', icon: <ShowChartIcon />, link: '/analyzers'},
    {text: 'Чарты', icon: <InsertChartIcon />, link: '/charts'},
    {text: 'Промо-посты', icon: <ImageSearchIcon />, link: '/grabbers'},
]


const theme = createMuiTheme({
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 13,
    },
    palette: {
        type: 'light',
        primary: {
            main: blueGrey[900],
        },
        secondary: {
            main: blueGrey[700],
        },
    },
}, ruRU);


const checkLoggedIn = () => {
    let loggedIn = false

    const token = localStorage.getItem('token')
    if (token) {
        const decodedToken = jwt.decode(token)
        const dateNow = new Date()
        if (decodedToken.exp * 1000 > dateNow.getTime())
            loggedIn = true
    }

    return loggedIn
}


const App = () => {

    const isLoggedInCheck = checkLoggedIn()
    const [isLoggedIn, changeLoggedInStatus] = useState(isLoggedInCheck)
    const [user, setUser] = useState({
        username: 'unknown',
        avaUrl: 'https://bizraise.pro/wp-content/uploads/2014/09/no-avatar-300x300.png'
    })

    const fetchUser = async () => {
        const checkUserResponse = (resp) => {
            if (typeof resp !== 'undefined') {
                setUser(resp)
            }
        }
        const api = new ApiService()
        api.getUser().then(checkUserResponse)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const onBindVk = () => {
        const api = new ApiService()
        api.bindVk(user.username)
    }

    const onUnbindVk = () => {
        const api = new ApiService()
        api.unbindVk().then(() => {window.location.reload()})
    }

    let data = (
        <Switch>
            <Route path='/login' render={() => <LoginPage changeLoggedInStatus={changeLoggedInStatus}/>}/>
            <Redirect to='/login'/>
        </Switch>
    )

    if (isLoggedIn) {
        data = (
            <NavigationPanel leftPanelListItems={leftPanelListItems} user={user} onBindVk={onBindVk} onUnbindVk={onUnbindVk}>
                <Pages/>
            </NavigationPanel>
        )
    }

    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                {data}
            </Router>
        </MuiThemeProvider>
    )
}

export default App