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
import Button from "@material-ui/core/Button";
import {useStyles, getComparator, stableSort, EnhancedTableHead, FilterToolbar} from "../table-functions";


const headCells = [
    { id: 'name', align: 'left', label: 'Наименование', tooltip: 'Исполнитель или полное название трека' },
    { id: 'shareUsers', align: 'right', label: 'Доля у пользователей', tooltip: 'У скольки пользователей в аудиозаписях встречается' },
    { id: 'shareItems', align: 'right', label: 'Доля в аудиозаписях', tooltip: 'Какую часть занимает среди всех аудиозаписей всех пользователей' },
]


function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}


export default function ListenersTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('shareUsers');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [rows, setRows] = React.useState(props.rows);

    const allRows = props.rows
    const { handleDownload, handleDelete } = props

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
                    <FilterToolbar handleChange={handleChangeFilter} placeholder='введи наименование для поиска'/>
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
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="right">{ `${roundToTwo(row.shareUsers * 100)} %` }</TableCell>
                                            <TableCell align="right">{ `${roundToTwo(row.shareItems * 100)} %` }</TableCell>
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
                                Удалить
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
}
