import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Avatar from "@material-ui/core/Avatar";
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ErrorIcon from '@material-ui/icons/Error';
import PauseIcon from '@material-ui/icons/Pause';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import {dateStrFromParam, spacedNumber} from "../../../services/api-service";
import {useStyles, getComparator, stableSort, EnhancedTableHead, FilterToolbar} from "../table-functions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LinkIcon from "@material-ui/icons/Link";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import DoneIcon from "@material-ui/icons/Done";


const headCells = [
    { id: 'groupAva', align: 'left', label: '', tooltip: 'Аватар паблика' },
    { id: 'groupName', align: 'left', label: 'Сообщество', tooltip: 'Название сообщества в ВК' },
    { id: 'groupUrl', align: 'left', label: 'Адрес сообщества', tooltip: 'Заданный при запуске задачи адрес сообщества' },
    { id: 'groupLink', align: 'center', label: 'Ссылка', tooltip: 'Ссылка на сообщество в ВК' },
    { id: 'status', align: 'center',  label: 'Статус', tooltip: 'Статус задачи' },
    { id: 'adsOnly', align: 'center',  label: 'Только промо-посты', tooltip: 'Заданная настройка сбора только постов, помеченных как рекламные' },
    { id: 'withAds', align: 'center',  label: 'С промо-постами', tooltip: 'Заданная настройка сбора всех постов, включая скрытые рекламные' },
    { id: 'withAudio', align: 'center',  label: 'C аудио', tooltip: 'Заданная настройка сбора только постов, с прикрепленными аудиозаписями или плейлистами' },
    { id: 'dateFrom', align: 'right',  label: 'Дата от', tooltip: 'Заданная начальная дата диапазона дат для поиска постов' },
    { id: 'dateTo', align: 'right',  label: 'Дата до', tooltip: 'Заданная конечная дата диапазона дат для поиска постов' },
    { id: 'postsCount', align: 'right',  label: 'Найдено постов', tooltip: 'Количество постов, найденных при заданных настройках' },
    { id: 'startDate', align: 'right',  label: 'Дата создания', tooltip: 'Дата создания задачи' },
    { id: 'finishDate', align: 'right',  label: 'Дата завершения', tooltip: 'Дата завершения задачи' },
]


const icons = [

    <Tooltip title='Ошибка' >
        <TableCell align="center" >
            <ErrorIcon color='error' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущена' >
        <TableCell align="center">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Завершена'>
        <TableCell align="center" >
            <CheckCircleIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Ожидает очереди'>
        <TableCell align="center" >
            <PauseIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Отменена' >
        <TableCell align="center" >
            <ErrorIcon color='disabled' />
        </TableCell>
    </Tooltip>,

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


export default function GrabbersTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('startDate');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState(props.rows);

    const allRows = props.rows
    const coverSize = dense ? {width: 30, height: 30} : {width: 50, height: 50}

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

    const handleChangeFilter = (event) => {
        const value = event.target.value
        const filteredRows = allRows.filter(row => row.groupName.toLowerCase().indexOf(value.toLowerCase()) > -1)
        setRows(filteredRows)
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <FilterToolbar handleChange={handleChangeFilter} placeholder='введи название сообщества для поиска'/>
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

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/grabber/${row.grabberId}`} underline='none'>
                                                    <Avatar src={row.groupAva} alt='cover' style={coverSize} />
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/grabber/${row.grabberId}`} underline='none'>
                                                    {row.groupName}
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/grabber/${row.grabberId}`} underline='none'>
                                                    {row.groupUrl}
                                                </Link>
                                            </TableCell>

                                            {
                                                row.groupLink ? <Tooltip title='Открыть сообщество в ВК'>
                                                    <TableCell align="center" onClick={() => {handleClick(row.groupLink)}} >
                                                        <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                    </TableCell>
                                                </Tooltip> : <TableCell />
                                            }

                                            { icons[row.status] }
                                            { falseTrueIcons[row.adsOnly] }
                                            { falseTrueIcons[row.withAds] }
                                            { falseTrueIcons[row.withAudio] }

                                            <TableCell align="right">{row.dateFrom}</TableCell>
                                            <TableCell align="right">{row.dateTo}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.postsCount)}</TableCell>
                                            <TableCell align="right">{dateStrFromParam(row.startDate)}</TableCell>
                                            <TableCell align="right">{dateStrFromParam(row.finishDate)}</TableCell>

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

            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Компактный вид"
            />
        </div>
    );
}
