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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import DoneIcon from '@material-ui/icons/Done';
import PauseIcon from '@material-ui/icons/Pause';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import LinkIcon from "@material-ui/icons/Link";
import ApiService from "../../../services/api-service";
import {dateStrFromParam, spacedNumber} from "../../../services/api-service";
import {useStyles, getComparator, stableSort, EnhancedTableHead, FilterToolbar} from "../table-functions";


const headCells = [
    { id: 'methodName', align: 'left', label: 'Метод', tooltip: 'Метод парсинга добавлений' },
    { id: 'methodParam', align: 'left', label: 'Параметр', tooltip: 'Параметр метода парсинга добавлений' },
    { id: 'parsSavers', align: 'center', label: 'Полная база', tooltip: 'Вариант сбора базы: полная база с айди пользователей или только количество добавлений' },
    { id: 'status', align: 'center', label: 'Статус', tooltip: 'Статус парсера' },
    { id: 'audiosCount', align: 'right', label: 'Аудиозаписи', tooltip: 'Количество собранных аудиозаписей' },
    { id: 'saversCount', align: 'right', label: 'Добавления', tooltip: 'Сумма неуникальных добавлений у собранных аудиозаписей' },
    { id: 'resultPath', align: 'right', label: 'База', tooltip: 'Ссылка на скачивание собранной базы' },
    { id: 'startDate', align: 'right', label: 'Дата создания', tooltip: 'Дата запуска парсера' },
    { id: 'finishDate', align: 'right', label: 'Дата завершения', tooltip: 'Дата завершения парсинга' }
]


const statusIcons = [

    <Tooltip title='Ошибка' >
        <TableCell align="center" >
            <ErrorIcon color='error' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущен' >
        <TableCell align="center">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Завершен'>
        <TableCell align="center" >
            <CheckCircleIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Ожидает очереди'>
        <TableCell align="center" >
            <PauseIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Отменен' >
        <TableCell align="center" >
            <ErrorIcon color='disabled' />
        </TableCell>
    </Tooltip>,

]


const parsSaversIcons = [

    <Tooltip title='Только количество добавлений' >
        <TableCell align="center" >
            <NotInterestedIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Полная база по добавлниям' >
        <TableCell align="center">
            <DoneIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

]


export default function ParsersTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('startDate');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState(props.rows);

    const allRows = props.rows

    const handleDownload = (id, path) => {
        const api = new ApiService()
        api.downloadParsingResult(id, path)
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

    const parsingResultCell = (id, path) => {
        if (path !== null) {
            return (
                <Tooltip title='Скачать результат парсинга'>
                    <TableCell align="right" onClick={() => {handleDownload(id, path)}}  >
                        <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                    </TableCell>
                </Tooltip>
            )
        } else {
            return <TableCell />
        }
    }

    const handleChangeFilter = (event) => {
        const value = event.target.value
        const filteredRows = allRows.filter(row => row.methodParam.toLowerCase().indexOf(value.toLowerCase()) > -1)
        setRows(filteredRows)
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <FilterToolbar handleChange={handleChangeFilter} placeholder='введи значение параметра для поиска'/>
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

                                            <Tooltip title='Открыть результат парсинга'>
                                                <TableCell align="left" >
                                                    <Link component={RouterLink} to={`/parser/${row.id}`} underline='none'>
                                                        {row.methodName}
                                                    </Link>
                                                </TableCell>
                                            </Tooltip>

                                            <Tooltip title='Открыть результат парсинга'>
                                                <TableCell align="left" >
                                                    <Link component={RouterLink} to={`/parser/${row.id}`} underline='none'>
                                                        {row.methodParam}
                                                    </Link>
                                                </TableCell>
                                            </Tooltip>

                                            { parsSaversIcons[row.parsSavers] }
                                            { statusIcons[row.status] }

                                            <TableCell align="right">{spacedNumber(row.audiosCount)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.saversCount)}</TableCell>

                                            { parsingResultCell(row.id, row.resultPath) }

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
