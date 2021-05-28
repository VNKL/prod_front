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
import PauseIcon from '@material-ui/icons/Pause';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import {dateStrFromParam, spacedNumber} from "../../../services/api-service";
import {useStyles, getComparator, stableSort, EnhancedTableHead, FilterToolbar} from "../table-functions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";


const headCells = [
    { id: 'name', align: 'left', label: 'Название задачи', tooltip: 'Название задачи, заданное при ее запуске' },
    { id: 'type', align: 'left',  label: 'Тип', tooltip: 'Параметр анализа - треки или исполнители' },
    { id: 'status', align: 'center', label: 'Статус', tooltip: 'Статус задачи' },
    { id: 'nLast', align: 'right',  label: 'Последние добавления', tooltip: 'Колиество последних добавлений пользователя, которые будут анализироваться' },
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


export default function ListenersesTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('startDate');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState(props.rows);

    const allRows = props.rows

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
        const filteredRows = allRows.filter(row => row.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
        setRows(filteredRows)
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <FilterToolbar handleChange={handleChangeFilter} placeholder='введи название задачи для поиска'/>
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
                                                <Link component={RouterLink} to={`/listeners_result/${row.listenersId}`} underline='none'>
                                                    {row.name}
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left">{row.type}</TableCell>

                                            { icons[row.status] }

                                            <TableCell align="right">{spacedNumber(row.nLast)}</TableCell>
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
