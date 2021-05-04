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
import LinkIcon from '@material-ui/icons/Link';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useStyles, getComparator, stableSort, EnhancedTableHead} from "../table-functions";


const headCells = [
    { id: 'name', align: 'left', label: 'Артист', tooltip: 'Имя артиста, указанное на его карточке в ВК' },
    { id: 'cardLink', align: 'left', label: 'Карточка артиста', tooltip: 'Карточка артиста' },
    { id: 'cardUrl', align: 'center', label: 'Ссылка на карточку', tooltip: 'Ссылка на карточку артиста в ВК' },
    { id: 'groupName', align: 'left', label: 'Паблик артиста', tooltip: 'Название паблика, указанного на карточке артиста' },
    { id: 'groupUrl', align: 'center', label: 'Ссылка на паблик', tooltip: 'Ссылка на паблик, указанный на карточке артиста' },
    { id: 'userName', align: 'left', label: 'Личная страница артиста', tooltip: 'Название личной страницы, указанной на карточке артиста' },
    { id: 'userUrl', align: 'center', label: 'Ссылка на страницу', tooltip: 'Ссылка на личную страницу, указанную на карточке артиста' },
]


export default function RelatedTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
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
                                            <TableCell align="left">{row.name}</TableCell>

                                            <TableCell align="left">{row.cardLink}</TableCell>

                                            <Tooltip title='Открыть карточку артиста в ВК'>
                                                <TableCell align="center" onClick={() => {handleClick(row.cardUrl)}} >
                                                    <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                </TableCell>
                                            </Tooltip>

                                            { row.groupName ? <TableCell align="left">{row.groupName}</TableCell> : <TableCell /> }

                                            {
                                                row.groupUrl ? <Tooltip title='Открыть паблик артиста в ВК'>
                                                    <TableCell align="center" onClick={() => {handleClick(row.groupUrl)}} >
                                                        <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                    </TableCell>
                                                </Tooltip> : <TableCell />
                                            }

                                            { row.userName ? <TableCell align="left">{row.userName}</TableCell> : <TableCell /> }

                                            {
                                                row.userUrl ? <Tooltip title='Открыть личную страницу артиста в ВК'>
                                                    <TableCell align="center" onClick={() => {handleClick(row.userUrl)}} >
                                                        <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                    </TableCell>
                                                </Tooltip> : <TableCell />
                                            }

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
