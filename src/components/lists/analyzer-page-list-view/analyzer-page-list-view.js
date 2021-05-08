import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import GroupIcon from '@material-ui/icons/Group';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AlbumIcon from '@material-ui/icons/Album';
import {spacedNumber} from "../../../services/api-service";
import VideocamIcon from '@material-ui/icons/Videocam';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import RadioIcon from '@material-ui/icons/Radio';
import CallMadeIcon from '@material-ui/icons/CallMade';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import BarChartIcon from '@material-ui/icons/BarChart';
import TimelineIcon from '@material-ui/icons/Timeline';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    firstLeft: {
        paddingLeft: theme.spacing(6),
    },
    secondLeft: {
        paddingLeft: theme.spacing(8),
    },
    thirdLeft: {
        paddingLeft: theme.spacing(12),
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

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 700,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const refactReleaseDate = (date) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString()
}

const refactChartPositionDate = (date) => {
    const dateArray = date.split('-')
    return `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`
}


const getAccountIcon = (link) => {
    if (link.type === 'user_page') {
        return (
            <Tooltip title="Личная страница" arrow >
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
            </Tooltip>
        )
    } else {
        return (
            <Tooltip title="Сообщество" arrow >
                <ListItemIcon>
                    <GroupIcon />
                </ListItemIcon>
            </Tooltip>
        )
    }
}

const getReleaseLink = (release) => {
    return `https://vk.com/music/album/${release.owner_id}_${release.playlist_id}_${release.access_key}`
}

const getVideoLink = (video) => {
    return `https://vk.com/video${video.owner_id}_${video.video_id}`
}

const getChartsTooltip = (release) => {
    const charts = release.charts
    const chartsKeys = Object.keys(release.charts)
    return (
        <List>
            {
                chartsKeys.map((item, idx) => {
                    return (
                        <ListItem key={idx}>
                            <ListItemText primary={servicesNames[item]}
                                          secondary={`Дней в чарте: ${charts[item].days_in_chart} | 
                                                      Лучшая позиция: ${charts[item].top_position} | 
                                                      Дата лучшей позиции: ${refactChartPositionDate(charts[item].last_top_date)}`} />
                        </ListItem>
                    )
                })
            }
        </List>
    )
}

const getChartTracksTooltip = (tracks) => {
    return (
        <List>
            {
                tracks.map((item, idx) => {
                    return (
                        <ListItem key={idx}>
                            <ListItemText primary={`${item.artist} – ${item.title}`}
                                          secondary={`Дней в чарте: ${item.days_in_chart} | 
                                                      Лучшая позиция: ${item.top_position} | 
                                                      Дата лучшей позиции: ${refactChartPositionDate(item.last_top_date)}`} />
                        </ListItem>
                    )
                })
            }
        </List>
    )
}


const renderAccounts = (links, openLinks, handleOpenLinks, classes) => {
    if (!links) {return null}

    return (
        <React.Fragment>

            <ListItem key='accounts' button onClick={handleOpenLinks}>
                <ListItemIcon> <AccountBoxIcon /> </ListItemIcon>
                <ListItemText primary='Страницы'
                              secondary='Ссылки на страницы артиста в ВК с карточки артиста'/>
                {openLinks ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openLinks} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        links.map((link, idx) => {
                            return (
                                <ListItem key={idx} button className={classes.firstLeft} onClick={() => {window.open(link.url)}}>
                                    { getAccountIcon(link) }
                                    <ListItemText primary={link.title} secondary={link.subtitle}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openLinks ? <Divider /> : null }

        </React.Fragment>
    )
}


const renderReleases = (releases, openReleases, handleOpenReleases,
                                  openSingles, handleOpenSingles,
                                  openAlbums, handleOpenAlbums, classes) => {
    if (!releases) {return null}

    return (
        <React.Fragment>

            <ListItem button onClick={handleOpenReleases}>
                <ListItemIcon> <LibraryMusicIcon /> </ListItemIcon>
                <ListItemText primary='Релизы'
                              secondary='Релизы артиста + релизы, в которых он принял участие'/>
                {openReleases ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openReleases} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    { renderSingles(releases.singles, openSingles, handleOpenSingles, classes) }
                    { renderAlbums(releases.albums, openAlbums, handleOpenAlbums, classes) }
                </List>
            </Collapse>

            { openReleases ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderSingles = (singles, openSingles, handleOpenSingles, classes) => {
    if (!singles) {return null}

    return (
        <React.Fragment>

            <ListItem key='singles' button onClick={handleOpenSingles} className={classes.firstLeft}>
                <ListItemIcon> <MusicNoteIcon /> </ListItemIcon>
                <ListItemText primary='Синглы'
                              secondary={`Количество: ${spacedNumber(singles.count)} | 
                                          Медиана прослушиваний: ${spacedNumber(singles.listens_median)} | 
                                          Медиана добавлений: ${spacedNumber(singles.followers_median)}`} />
                {openSingles ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openSingles} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        singles.items.map((item, idx) => {
                            return (
                                <ListItem key={idx} button className={classes.secondLeft} onClick={() => {window.open(getReleaseLink(item))}}>
                                    <ListItemIcon> <MusicNoteIcon /> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Дата: ${refactReleaseDate(item.date)} | 
                                                              Прослушивания: ${spacedNumber(item.listens)} | 
                                                              Добавления: ${spacedNumber(item.followers)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openSingles ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderAlbums = (albums, openAlbums, handleOpenAlbums, classes) => {
    if (!albums) {return null}

    return (
        <React.Fragment>

            <ListItem key='albums' button onClick={handleOpenAlbums} className={classes.firstLeft}>
                <ListItemIcon> <AlbumIcon /> </ListItemIcon>
                <ListItemText primary='Альбомы'
                              secondary={`Количество: ${spacedNumber(albums.count)} | 
                                          Медиана прослушиваний: ${spacedNumber(albums.listens_median)} | 
                                          Медиана добавлений: ${spacedNumber(albums.followers_median)}`} />
                {openAlbums ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openAlbums} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        albums.items.map((item, idx) => {
                            return (
                                <ListItem key={idx} button className={classes.secondLeft} onClick={() => {window.open(getReleaseLink(item))}}>
                                    <ListItemIcon> <AlbumIcon /> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Дата: ${refactReleaseDate(item.date)} | 
                                                              Прослушивания: ${spacedNumber(item.listens)} | 
                                                              Добавления: ${spacedNumber(item.followers)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openAlbums ? <Divider /> : null }

        </React.Fragment>
    )
}


const renderVideos = (videos, openVideos, handleOpenVideos, classes) => {
    if (!videos) {return null}

    return (
        <React.Fragment>

            <ListItem key='videos' button onClick={handleOpenVideos} >
                <ListItemIcon> <VideocamIcon /> </ListItemIcon>
                <ListItemText primary='Музыкальные видео'
                              secondary={`Количество: ${spacedNumber(videos.count)} | 
                                          Просмотры -всего: ${spacedNumber(videos.views_sum)}, 
                                                    -мин: ${spacedNumber(videos.views_min)},
                                                    -макс: ${spacedNumber(videos.views_max)},
                                                    -медиана: ${spacedNumber(videos.views_median)}`} />
                {openVideos ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openVideos} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        videos.items.map((item, idx) => {
                            return (
                                <ListItem key={idx} button className={classes.firstLeft} onClick={() => {window.open(getVideoLink(item))}}>
                                    <ListItemIcon> <VideocamIcon /> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Дата: ${refactReleaseDate(item.date)} | 
                                                              Просмотры: ${spacedNumber(item.views)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openVideos ? <Divider /> : null }

        </React.Fragment>
    )
}


const renderGenres = (genres, openGenres, handleOpenGenres, classes) => {
    if (!genres) {return null}

    return (
        <React.Fragment>

            <ListItem key='genres' button onClick={handleOpenGenres} >
                <ListItemIcon> <RadioIcon /> </ListItemIcon>
                <ListItemText primary='Жанры релизов'
                              secondary='Жанры, указанные на релизных плейлистах артиста' />
                {openGenres ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openGenres} timeout="auto" unmountOnExit>
                <List component="div" disablePadding >
                    <ListItem key='genres_all' className={classes.firstLeft} >
                        <ListItemIcon> <RadioIcon /> </ListItemIcon>
                        <ListItemText primary='Все релизы артиста'
                                      secondary={genres.all_releases_genres.join(', ')} />
                    </ListItem>
                    <ListItem key='genres_last' className={classes.firstLeft} >
                        <ListItemIcon> <RadioIcon /> </ListItemIcon>
                        <ListItemText primary='Последние релизы артиста'
                                      secondary={genres.last_releases_genres.join(', ')} />
                    </ListItem>
                    <ListItem key='genres_top' className={classes.firstLeft} >
                        <ListItemIcon> <RadioIcon /> </ListItemIcon>
                        <ListItemText primary='Популярные релизы артиста'
                                      secondary={genres.top_releases_genres.join(', ')} />
                    </ListItem>
                </List>
            </Collapse>

            { openGenres ? <Divider /> : null }

        </React.Fragment>
    )
}




const renderTop = (top, openTop, handleOpenTop, classes,
                   openTopStreamingTracks, handleOpenTopStreamingTracks,
                   openTopSavingTracks, handleOpenTopSavingTracks,
                   openTopListeningSingles, handleOpenTopListeningSingles,
                   openTopListeningAlbums, handleOpenTopListeningAlbums,) => {
    if (!top) {return null}

    return (
        <React.Fragment>

            <ListItem key='top' button onClick={handleOpenTop}>
                <ListItemIcon> <CallMadeIcon /> </ListItemIcon>
                <ListItemText primary='Топы по артисту'
                              secondary='Лучшие результаты артиста по некоторым параметрам'/>
                {openTop ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openTop} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    { renderTopStreamingTracks(top.top_streaming_tracks, openTopStreamingTracks, handleOpenTopStreamingTracks, classes) }
                    { renderTopSavingTracks(top.top_saving_tracks, openTopSavingTracks, handleOpenTopSavingTracks, classes) }
                    { renderTopListeningSingles(top.top_listening_singles, openTopListeningSingles, handleOpenTopListeningSingles, classes) }
                    { renderTopListeningAlbums(top.top_listening_albums, openTopListeningAlbums, handleOpenTopListeningAlbums, classes) }
                </List>
            </Collapse>

            { openTop ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderTopStreamingTracks = (topStreamingTracks, openTopStreamingTracks, handleOpenTopStreamingTracks, classes) => {
    if (!topStreamingTracks) {return null}

    return (
        <React.Fragment>

            <ListItem key='top_streaming' button onClick={handleOpenTopStreamingTracks} className={classes.firstLeft}>
                <ListItemIcon> <MusicNoteIcon /> </ListItemIcon>
                <ListItemText primary='Актуальный стриминг'
                              secondary={`Самые прослушиваемые на дату анализа треки артиста`} />
                {openTopStreamingTracks ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openTopStreamingTracks} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        topStreamingTracks.map((item, idx) => {
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <ListItemIcon > <Avatar style={{width: 25, height: 25}}> {idx + 1} </Avatar> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Дата релиза: ${refactReleaseDate(item.date)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openTopStreamingTracks ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderTopSavingTracks = (topSavingTracks, openTopSavingTracks, handleOpenTopSavingTracks, classes) => {
    if (!topSavingTracks) {return null}

    return (
        <React.Fragment>

            <ListItem key='top_saving' button onClick={handleOpenTopSavingTracks} className={classes.firstLeft}>
                <ListItemIcon> <SaveIcon /> </ListItemIcon>
                <ListItemText primary='Добавления треков'
                              secondary={`Самые добавляемые на дату анализа треки артиста`} />
                {openTopSavingTracks ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openTopSavingTracks} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        topSavingTracks.map((item, idx) => {
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <ListItemIcon > <Avatar style={{width: 25, height: 25}}> {idx + 1} </Avatar> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Добавления трека: ${spacedNumber(item.savers_count)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openTopSavingTracks ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderTopListeningSingles = (topListeningSingles, openTopListeningSingles, handleOpenTopListeningSingles, classes) => {
    if (!topListeningSingles) {return null}

    return (
        <React.Fragment>

            <ListItem key='top_singles' button onClick={handleOpenTopListeningSingles} className={classes.firstLeft}>
                <ListItemIcon> <MusicNoteIcon /> </ListItemIcon>
                <ListItemText primary='Прослушивания синглов'
                              secondary={`Самые прослушиваемые на дату анализа релизные плейлисты синглов артиста`} />
                {openTopListeningSingles ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openTopListeningSingles} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        topListeningSingles.map((item, idx) => {
                            return (
                                <ListItem key={idx} button className={classes.secondLeft} onClick={() => {window.open(getReleaseLink(item))}}>
                                    <ListItemIcon > <Avatar style={{width: 25, height: 25}}> {idx + 1} </Avatar> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Прослушивания: ${spacedNumber(item.listens)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openTopListeningSingles ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderTopListeningAlbums = (topListeningAlbums, openTopListeningAlbums, handleOpenTopListeningAlbums, classes) => {
    if (!topListeningAlbums) {return null}

    return (
        <React.Fragment>

            <ListItem key='top_albums' button onClick={handleOpenTopListeningAlbums} className={classes.firstLeft}>
                <ListItemIcon> <AlbumIcon /> </ListItemIcon>
                <ListItemText primary='Прослушивания альбомов'
                              secondary={`Самые прослушиваемые на дату анализа релизные плейлисты альбомов артиста`} />
                {openTopListeningAlbums ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openTopListeningAlbums} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        topListeningAlbums.map((item, idx) => {
                            return (
                                <ListItem key={idx} button className={classes.secondLeft} onClick={() => {window.open(getReleaseLink(item))}}>
                                    <ListItemIcon > <Avatar style={{width: 25, height: 25}}> {idx + 1} </Avatar> </ListItemIcon>
                                    <ListItemText primary={item.name}
                                                  secondary={`Прослушивания: ${spacedNumber(item.listens)}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openTopListeningAlbums ? <Divider /> : null }

        </React.Fragment>
    )
}



const renderCharts = (charts, openCharts, handleOpenCharts, classes,
                              openChartsAllTime, handleOpenChartsAllTime,
                              openChartsLast356, handleOpenChartsLast365,
                              openChartsLast90, handleOpenChartsLast90,
                              openChartsNow, handleOpenChartsNow,) => {
    if (!charts) {return null}

    if (!charts.now && !charts.last_90 && !charts.last_365 && !charts.all_time) {return null}

    return (
        <React.Fragment>

            <ListItem key='charts' button onClick={handleOpenCharts}>
                <ListItemIcon> <BarChartIcon /> </ListItemIcon>
                <ListItemText primary='Чарты'
                              secondary='Релизы артиста в чартах'/>
                {openCharts ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openCharts} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    { charts.now ? renderChartsNow(charts.now, openChartsNow, handleOpenChartsNow, classes) : null }
                    { charts.last_90 ? renderChartsLast90(charts.last_90, openChartsLast90, handleOpenChartsLast90, classes) : null }
                    { charts.last_365 ? renderChartsLast365(charts.last_365, openChartsLast356, handleOpenChartsLast365, classes) : null }
                    { charts.all_time ? renderChartsAllTime(charts.all_time, openChartsAllTime, handleOpenChartsAllTime, classes) : null }
                </List>
            </Collapse>

            { openCharts ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderChartsNow = (chartsNow, openChartsNow, handleOpenChartsNow, classes) => {
    if (!chartsNow) {return null}

    return (
        <React.Fragment>

            <ListItem key='charts_now' button onClick={handleOpenChartsNow} className={classes.firstLeft}>
                <ListItemIcon> <BarChartIcon /> </ListItemIcon>
                <ListItemText primary='Сейчас'
                              secondary={`Количество треков: ${chartsNow.length}`} />
                {openChartsNow ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsNow} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        chartsNow.map((item, idx) => {
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <HtmlTooltip title={getChartsTooltip(item)}>
                                        <ListItemIcon > <Avatar src={item.cover_url} alt='cover' /> </ListItemIcon>
                                    </HtmlTooltip>
                                    <ListItemText primary={`${item.artist} – ${item.title}`}
                                                  secondary={`Количество чартов: ${Object.keys(item.charts).length}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsNow ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderChartsLast90 = (chartsLast90, openChartsLast90, handleOpenChartsLast90, classes) => {
    if (!chartsLast90) {return null}

    return (
        <React.Fragment>

            <ListItem key='charts_90' button onClick={handleOpenChartsLast90} className={classes.firstLeft}>
                <ListItemIcon> <BarChartIcon /> </ListItemIcon>
                <ListItemText primary='Последний квартал'
                              secondary={`Количество треков: ${chartsLast90.length}`} />
                {openChartsLast90 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsLast90} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        chartsLast90.map((item, idx) => {
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <HtmlTooltip title={getChartsTooltip(item)}>
                                        <ListItemIcon > <Avatar src={item.cover_url} alt='cover' /> </ListItemIcon>
                                    </HtmlTooltip>
                                    <ListItemText primary={`${item.artist} – ${item.title}`}
                                                  secondary={`Количество чартов: ${Object.keys(item.charts).length}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsLast90 ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderChartsLast365 = (chartsLast365, openChartsLast356, handleOpenChartsLast365, classes) => {
    if (!chartsLast365) {return null}

    return (
        <React.Fragment>

            <ListItem key='charts_365' button onClick={handleOpenChartsLast365} className={classes.firstLeft}>
                <ListItemIcon> <BarChartIcon /> </ListItemIcon>
                <ListItemText primary='Последний год'
                              secondary={`Количество треков: ${chartsLast365.length}`} />
                {openChartsLast356 ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsLast356} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        chartsLast365.map((item, idx) => {
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <HtmlTooltip title={getChartsTooltip(item)}>
                                        <ListItemIcon > <Avatar src={item.cover_url} alt='cover' /> </ListItemIcon>
                                    </HtmlTooltip>
                                    <ListItemText primary={`${item.artist} – ${item.title}`}
                                                  secondary={`Количество чартов: ${Object.keys(item.charts).length}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsLast356 ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderChartsAllTime = (chartsAllTime, openChartsAllTime, handleOpenChartsAllTime, classes) => {
    if (!chartsAllTime) {return null}

    return (
        <React.Fragment>

            <ListItem key='charts_all' button onClick={handleOpenChartsAllTime} className={classes.firstLeft}>
                <ListItemIcon> <BarChartIcon /> </ListItemIcon>
                <ListItemText primary='Все время'
                              secondary={`Количество треков: ${chartsAllTime.length}`} />
                {openChartsAllTime ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsAllTime} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        chartsAllTime.map((item, idx) => {
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <HtmlTooltip title={getChartsTooltip(item)}>
                                        <ListItemIcon > <Avatar src={item.cover_url} alt='cover' /> </ListItemIcon>
                                    </HtmlTooltip>
                                    <ListItemText primary={`${item.artist} – ${item.title}`}
                                                  secondary={`Количество чартов: ${Object.keys(item.charts).length}`}/>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsAllTime ? <Divider /> : null }

        </React.Fragment>
    )
}



const renderChartsTop = (chartsTop, openChartsTop, handleOpenChartsTop, classes,
                        openChartsTopDays, handleOpenChartsTopDays,
                        openChartsTopPositions, handleChartsTopPositions) => {
    if (!chartsTop) {return null}

    return (
        <React.Fragment>

            <ListItem key='charts_top' button onClick={handleOpenChartsTop}>
                <ListItemIcon> <TimelineIcon /> </ListItemIcon>
                <ListItemText primary='Топы артиста по чартам'
                              secondary='Наилучшие показатели релизов артиста в чартах'/>
                {openChartsTop ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsTop} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    { renderChartsTopDays(chartsTop.days, openChartsTopDays, handleOpenChartsTopDays, classes) }
                    { renderChartsTopPositions(chartsTop.positions, openChartsTopPositions, handleChartsTopPositions, classes) }
                </List>
            </Collapse>

            { openChartsTop ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderChartsTopDays = (topDays, openChartsTopDays, handleOpenChartsTopDays, classes) => {
    if (!topDays) {return null}

    const chartsArray = Object.keys(topDays)

    return (
        <React.Fragment>

            <ListItem key='charts_top_days' button onClick={handleOpenChartsTopDays} className={classes.firstLeft}>
                <ListItemIcon> <TimelineIcon /> </ListItemIcon>
                <ListItemText primary='По дням' secondary='Треки, находившиеся в чартах наибольшее количество дней'/>
                {openChartsTopDays ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsTopDays} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        chartsArray.map((chart, idx) => {
                            const bestName = `${topDays[chart][0].artist} – ${topDays[chart][0].title}`
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <HtmlTooltip title={getChartTracksTooltip(topDays[chart])}>
                                        <ListItemIcon> <Avatar> { chart } </Avatar> </ListItemIcon>
                                    </HtmlTooltip>
                                    <ListItemText primary={servicesNames[chart]}
                                                  secondary={bestName} />
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsTopDays ? <Divider /> : null }

        </React.Fragment>
    )
}

const renderChartsTopPositions = (topPositions, openChartsTopPositions, handleOpenChartsTopPositions, classes) => {
    if (!topPositions) {return null}

    const chartsArray = Object.keys(topPositions)

    return (
        <React.Fragment>

            <ListItem key='charts_top_positions' button onClick={handleOpenChartsTopPositions} className={classes.firstLeft}>
                <ListItemIcon> <TimelineIcon /> </ListItemIcon>
                <ListItemText primary='По позициям' secondary='Треки, находившиеся в чартах выше остальных'/>
                {openChartsTopPositions ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsTopPositions} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        chartsArray.map((chart, idx) => {
                            const bestName = `${topPositions[chart][0].artist} – ${topPositions[chart][0].title}`
                            return (
                                <ListItem key={idx} className={classes.secondLeft} >
                                    <HtmlTooltip title={getChartTracksTooltip(topPositions[chart])}>
                                        <ListItemIcon> <Avatar> { chart } </Avatar> </ListItemIcon>
                                    </HtmlTooltip>
                                    <ListItemText primary={servicesNames[chart]}
                                                  secondary={bestName} />
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsTopPositions ? <Divider /> : null }

        </React.Fragment>
    )
}



const renderChartsStats = (chartsStats, openChartsStats, handleOpenChartsStats, classes) => {
    if (!chartsStats) {return null}

    const chartsArray = Object.keys(chartsStats.days)

    return (
        <React.Fragment>

            <ListItem key='charts_stats' button onClick={handleOpenChartsStats} >
                <ListItemIcon> <DonutLargeIcon /> </ListItemIcon>
                <ListItemText primary='Чартовые медианы'
                              secondary='Медианные статистики релизов артиста в чартах' />
                {openChartsStats ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openChartsStats} timeout="auto" unmountOnExit>
                <List component="div" disablePadding >
                    {
                        chartsArray.map((item, idx) => {
                            const stats = `Дней в чарте: ${chartsStats.days[item]} | Позиция: ${chartsStats.positions[item]}`
                            return (
                                <ListItem key={idx} className={classes.thirdLeft} >
                                    <ListItemText primary={servicesNames[item]}
                                                  secondary={stats} />
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Collapse>

            { openChartsStats ? <Divider /> : null }

        </React.Fragment>
    )
}


const AnalyzerPageListView = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        openAccounts: false,
        openReleases: false,
        openSingles: false,
        openAlbums: false,
        openVideos: false,
        openGenres: false,

        openTop: false,
        openTopStreamingTracks: false,
        openTopSavingTracks: false,
        openTopListeningSingles: false,
        openTopListeningAlbums: false,

        openCharts: false,
        openChartsAllTime: false,
        openChartsLast356: false,
        openChartsLast90: false,
        openChartsNow: false,

        openChartsTop: false,
        openChartsTopDays: false,
        openChartsTopPositions: false,

        openChartsStats: false
    });

    const { anal } = props
    const releases = anal.singles ? {singles: anal.singles, albums: anal.albums} : null
    const accounts = anal.artist.links.length > 0 ? anal.artist.links : null
    const videos = anal.videos.count ? anal.videos : null
    const genres = anal ? anal.genres : null
    const top = anal ? anal.top : null
    const charts = anal.charts.all_time ? anal.charts : null
    const chartsTop = anal.charts.all_time ? {days: anal.charts.top_by_days, positions: anal.charts.top_by_positions} : null
    const chartsStats = anal.charts.days_medians ? {days: anal.charts.days_medians, positions: anal.charts.positions_medians} : null


    const handleOpenAccounts = () => {
        setState({...state, openAccounts: !state.openAccounts})
    }

    const handleOpenReleases = () => {
        setState({...state, openReleases: !state.openReleases})
    }

    const handleOpenSingles = () => {
        setState({...state, openSingles: !state.openSingles})
    }

    const handleOpenAlbums = () => {
        setState({...state, openAlbums: !state.openAlbums})
    }

    const handleOpenVideos = () => {
        setState({...state, openVideos: !state.openVideos})
    }

    const handleOpenGenres = () => {
        setState({...state, openGenres: !state.openGenres})
    }


    const handleOpenTop = () => {
        setState({...state, openTop: !state.openTop})
    }

    const handleOpenTopStreamingTracks = () => {
        setState({...state, openTopStreamingTracks: !state.openTopStreamingTracks})
    }

    const handleOpenTopSavingTracks = () => {
        setState({...state, openTopSavingTracks: !state.openTopSavingTracks})
    }

    const handleOpenTopListeningSingles = () => {
        setState({...state, openTopListeningSingles: !state.openTopListeningSingles})
    }

    const handleOpenTopListeningAlbums = () => {
        setState({...state, openTopListeningAlbums: !state.openTopListeningAlbums})
    }


    const handleOpenCharts = () => {
        setState({...state, openCharts: !state.openCharts})
    }

    const handleOpenChartsAllTime= () => {
        setState({...state, openChartsAllTime: !state.openChartsAllTime})
    }

    const handleOpenChartsLast365= () => {
        setState({...state, openChartsLast356: !state.openChartsLast356})
    }

    const handleOpenChartsLast90= () => {
        setState({...state, openChartsLast90: !state.openChartsLast90})
    }

    const handleOpenChartsNow= () => {
        setState({...state, openChartsNow: !state.openChartsNow})
    }


    const handleOpenChartsTop= () => {
        setState({...state, openChartsTop: !state.openChartsTop})
    }

    const handleOpenChartsTopDays= () => {
        setState({...state, openChartsTopDays: !state.openChartsTopDays})
    }

    const handleChartsTopPositions= () => {
        setState({...state, openChartsTopPositions: !state.openChartsTopPositions})
    }


    const handleOpenChartsStats = () => {
        setState({...state, openChartsStats: !state.openChartsStats})
    }


    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Результаты анализа
                </ListSubheader>
            }
            className={classes.root}
        >
            { renderAccounts(accounts, state.openAccounts, handleOpenAccounts, classes) }
            { renderReleases(releases, state.openReleases, handleOpenReleases,
                                       state.openSingles, handleOpenSingles,
                                       state.openAlbums, handleOpenAlbums, classes) }
            { renderVideos(videos, state.openVideos, handleOpenVideos, classes) }
            { renderGenres(genres, state.openGenres, handleOpenGenres, classes) }
            { renderTop(top, state.openTop, handleOpenTop, classes,
                             state.openTopStreamingTracks, handleOpenTopStreamingTracks,
                             state.openTopSavingTracks, handleOpenTopSavingTracks,
                             state.openTopListeningSingles, handleOpenTopListeningSingles,
                             state.openTopListeningAlbums, handleOpenTopListeningAlbums,) }
            { renderCharts(charts, state.openCharts, handleOpenCharts, classes,
                                   state.openChartsAllTime, handleOpenChartsAllTime,
                                   state.openChartsLast356, handleOpenChartsLast365,
                                   state.openChartsLast90, handleOpenChartsLast90,
                                   state.openChartsNow, handleOpenChartsNow,) }
            { renderChartsTop(chartsTop, state.openChartsTop, handleOpenChartsTop, classes,
                                         state.openChartsTopDays, handleOpenChartsTopDays,
                                         state.openChartsTopPositions, handleChartsTopPositions,) }
            { renderChartsStats(chartsStats, state.openChartsStats, handleOpenChartsStats, classes) }

        </List>
    );
}

export default AnalyzerPageListView