import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useStyles, getComparator, stableSort, EnhancedTableHead} from "../table-functions";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import DoneIcon from "@material-ui/icons/Done";
import {dateStrFromParam, spacedNumber} from "../../../services/api-service";


const headCells = [
    { id: 'postUrl', align: 'left', label: 'Пост', tooltip: 'Ссылка на пост в ВК' },
    { id: 'isAd', align: 'center', label: 'Рекламный', tooltip: 'Пост в ВК помечен, как рекламный' },
    { id: 'hasAudio', align: 'center', label: 'Есть аудио', tooltip: 'Во вложениях поста есть аудиозаписи' },
    { id: 'hasPlaylist', align: 'center', label: 'Есть плейлист', tooltip: 'Во вложениях поста есть плейлист' },
    { id: 'listens', align: 'right', label: 'Прослушивания', tooltip: 'Прослушивания на плейлисте из вложений поста (при наличии)' },
    { id: 'saves', align: 'right', label: 'Добавления', tooltip: 'Добавления плейлиста и аудиозаписей из вложений поста (при наличии)' },
    { id: 'doubles', align: 'right', label: 'Дубли аудио', tooltip: 'Аудиозаписи из вложений поста встречаются также во вложениях других постов из этой задачи (включая аудиозаписи внутри плейлистов)' },
    { id: 'likes', align: 'right', label: 'Лайки', tooltip: 'Количество лайков на посте' },
    { id: 'reposts', align: 'right', label: 'Репосты', tooltip: 'Количество репостов поста' },
    { id: 'comments', align: 'right', label: 'Комменты', tooltip: 'Количеситво комментариев на посте' },
    { id: 'postDate', align: 'right', label: 'Дата и время поста', tooltip: 'Дата и время поста' },
]


const falseTrueIcons = [

    <Tooltip title='Нет' >
        <TableCell align="center" >
            <NotInterestedIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Да' >
        <TableCell align="center">
            <DoneIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

]


export default function GrabberTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('postDate');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { rows, handleDownload, handleDelete } = props

    const handleClick = (url) => {
        window.open(url)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>

                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >

                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                        />

                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={index}
                                        >

                                            <Tooltip title='Открыть пост в ВК'>
                                                <TableCell align="left" onClick={() => {handleClick(row.postUrl)}} style={{cursor: 'pointer'}} >
                                                    { row.postUrl }
                                                </TableCell>
                                            </Tooltip>

                                            { falseTrueIcons[row.isAd] }
                                            { falseTrueIcons[row.hasAudio] }
                                            { falseTrueIcons[row.hasPlaylist] }

                                            <TableCell align="right">{spacedNumber(row.listens)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.saves)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.doubles)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.likes)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.reposts)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.comments)}</TableCell>
                                            <TableCell align="right">{dateStrFromParam(row.postDate)}</TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={headCells.length} />
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />

            </Paper>

            <Grid container>
                <Grid item align='left' xs={6}>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Компактный вид"
                    />
                </Grid>

                <Grid item align='right' xs={6}>
                    <Grid container align='right' spacing={1}>
                        <Grid item xs={9} />
                        <Grid item align='right' xs={3} >
                            <Button fullWidth variant='contained' color='secondary' onClick={handleDownload} >
                                Выгрузить результат
                            </Button>
                        </Grid>
                        <Grid item xs={9} />
                        <Grid item align='right'  xs={3}>
                            <Button fullWidth variant='contained' color='inherit' onClick={handleDelete} >
                                Удалить поиск
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
}
