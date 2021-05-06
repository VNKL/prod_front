import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    services: {
        paddingLeft: theme.spacing(12),
    },
    positions: {
        paddingLeft: theme.spacing(15),
    }
}));


const servicesNames = {
    am: 'Apple Music',
    vk: 'VK + BOOM',
    ok: 'OK + BOOM',
    dz: 'DEEZER',
    it: 'iTunes',
    ms: 'Mooscle',
    sz: 'Shazam',
    yt: 'YouTube',
    ym: 'Яндекс.Музыка',
    zv: 'СберЗвук',
    sp: 'Spotify',
}


const refactPositionDate = (date) => {
    const dateArray = date.split('-')
    return `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`
}


const renderPosition = (position, classes) => {
    return (
        <ListItem className={classes.positions} >
            <ListItemIcon>
                <Avatar > {position.current} </Avatar>
            </ListItemIcon>
            <ListItemText primary={refactPositionDate(position.date)}
                          secondary={`Предыдущая позиция: ${position.previous ? position.previous : '—'}, дельта: ${position.delta ? position.delta : '—'}`}/>
        </ListItem>
    )
}


const ChartsSearchListView = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        openedReleases: [],
        openedServices: []
    });

    const { releases } = props

    const handleOpenRelease = (releaseId) => {
        const openedReleases = state.openedReleases
        if (openedReleases.indexOf(releaseId) === -1) {
            openedReleases.push(releaseId)
        } else {
            const index = openedReleases.indexOf(releaseId)
            openedReleases.splice(index, 1)
        }
        setState({...state, openedReleases: openedReleases})
    };

    const handleOpenService = (releaseId, serviceId) => {
        const fullId = `${releaseId}-${serviceId}`
        const openedServices = state.openedServices
        if (openedServices.indexOf(fullId) === -1) {
            openedServices.push(fullId)
        } else {
            const index = openedServices.indexOf(fullId)
            openedServices.splice(index, 1)
        }
        setState({...state, openedServices: openedServices})
    };

    const checkReleaseOpen = (releaseId) => {
        return state.openedReleases.indexOf(releaseId) !== -1;
    }

    const checkServiceOpen = (releaseId, serviceId) => {
        const fullId = `${releaseId}-${serviceId}`
        return state.openedServices.indexOf(fullId) !== -1;
    }

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Результаты поиска
                </ListSubheader>
            }
            className={classes.root}
        >
            {
                releases.map((release) => {
                    return (
                        <React.Fragment>

                            <ListItem button onClick={() => {handleOpenRelease(release.id)}}>
                                <ListItemIcon> <Avatar src={release.coverUrl} alt='cover' /> </ListItemIcon>
                                <ListItemText primary={`${release.artist} - ${release.title}`}
                                              secondary={`Позиций: ${release.positionsCount}`}/>
                                {checkReleaseOpen(release.id) ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>

                            <Collapse in={checkReleaseOpen(release.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        release.positions.map((service) => {
                                            return (
                                                <React.Fragment>
                                                    <ListItem button className={classes.services}
                                                              onClick={() => {handleOpenService(release.id, service.service)}}>
                                                        <ListItemText primary={`${servicesNames[service.service]}`}
                                                                      secondary={`Позиций: ${service.positions.length}`}/>
                                                        {checkServiceOpen(release.id, service.service) ? <ExpandLess /> : <ExpandMore />}
                                                    </ListItem>

                                                    <Collapse in={checkServiceOpen(release.id, service.service)} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding>
                                                            {
                                                                service.positions.map((position) => {
                                                                    return renderPosition(position, classes)
                                                                })
                                                            }
                                                        </List>
                                                    </Collapse>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </List>
                                { checkReleaseOpen(release.id) ? <Divider /> : null }
                            </Collapse>

                        </React.Fragment>
                    )
                })
            }
        </List>
    );
}

export default ChartsSearchListView