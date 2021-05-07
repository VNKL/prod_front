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
import {dateStrFromParam} from "../../../services/api-service";
import {useStyles, getComparator, stableSort, EnhancedTableHead} from "../table-functions";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";


const headCells = [
    { id: 'photoUrl', align: 'left', label: '', tooltip: 'Фото с карточки артиста' },
    { id: 'artistName', align: 'left', label: 'Артист', tooltip: 'Имя артиста, указанное на его карточке в ВК' },
    { id: 'artistUrl', align: 'left', label: 'Карточка артиста', tooltip: 'Ссылка на карточку артиста в ВК' },
    { id: 'status', align: 'center', label: 'Статус', tooltip: 'Статус задачи' },
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


export default function AnalyzersTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('startDate');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const { rows } = props
    const coverSize = dense ? {width: 30, height: 30} : {width: 50, height: 50}

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

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/analyzer/${row.analyzerId}`} underline='none'>
                                                    <Avatar src={row.photoUrl} alt='cover' style={coverSize} />
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/analyzer/${row.analyzerId}`} underline='none'>
                                                    {row.artistName}
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/analyzer/${row.analyzerId}`} underline='none'>
                                                    {row.artistUrl}
                                                </Link>
                                            </TableCell>

                                            { icons[row.status] }

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
