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
import Grid from "@material-ui/core/Grid";
import {useStyles, getComparator, stableSort, EnhancedTableHead} from "../table-functions";
import {spacedNumber} from "../../../services/api-service";
import Avatar from "@material-ui/core/Avatar";


const headCells = [
    { id: 'coverUrl', align: 'left', label: '', tooltip: 'Обложка релиза' },
    { id: 'artist', align: 'left', label: 'Исполнитель', tooltip: 'Имя артиста или артистов, исполнящих трек' },
    { id: 'title', align: 'left', label: 'Название', tooltip: 'Название релиза' },
    // { id: 'distributor', align: 'left', label: 'Дистрибьютор', tooltip: 'Название дистрибьюотра, указанное на mooscle.com. Могут быть неточности' },
    { id: 'positionsCount', align: 'right', label: 'Количество позиций', tooltip: 'Количество позиций релиза во всех доступных в сервисе чартах' },
]


export default function ChartsSearchTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('positionsCount');
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
                                                <Avatar src={row.coverUrl} alt='cover' style={coverSize} />
                                            </TableCell>

                                            <TableCell align="left">{ row.artist }</TableCell>
                                            <TableCell align="left">{ row.title }</TableCell>
                                            {/*<TableCell align="left">{ row.distributor }</TableCell>*/}
                                            <TableCell align="right">{spacedNumber(row.positionsCount)}</TableCell>

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
            </Grid>
        </div>
    );
}
