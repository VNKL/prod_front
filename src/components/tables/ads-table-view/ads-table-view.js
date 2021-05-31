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
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import LinkIcon from '@material-ui/icons/Link';
import HelpIcon from '@material-ui/icons/Help';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {spacedNumber} from "../../../services/api-service";
import {useStyles, getComparator, stableSort, EnhancedTableHead, FilterToolbar} from "../table-functions";


const headCells = [
    { id: 'name', align: 'left', label: 'Сегмент', tooltip: 'Аудитория, которой показывается объявление' },
    { id: 'approved', align: 'right', label: 'Мод.', tooltip: 'Статус модерации объявления' },
    { id: 'status', align: 'right', label: 'Статус', tooltip: 'Статус объявления' },
    { id: 'spent', align: 'right',  label: 'Расход', tooltip: 'Потраченная сумма в рублях' },
    { id: 'reach', align: 'right',  label: 'Показы', tooltip: 'Показы объявлений' },
    { id: 'cpm', align: 'right',  label: 'CPM', tooltip: 'Стоимость тысячи показов в рублях' },
    { id: 'listens', align: 'right',  label: 'Прослуш.', tooltip: 'Прослушивания на плейлистах (не равно стримы)' },
    { id: 'cpl', align: 'right',  label: 'CPL', tooltip: 'Cost Per Listen - стоимость одного прослушивания в рублях' },
    { id: 'ltr', align: 'right',  label: 'LTR', tooltip: 'Listen Through Rate - конверсия из охвата в прослушивания' },
    { id: 'saves', align: 'right',  label: 'Добавл.', tooltip: 'Сохранения аудио и плейлистов из объявлений в аудиозаписях пользователей' },
    { id: 'cps', align: 'right',  label: 'CPS', tooltip: 'Cost Per Save - стоимость одного сохранения в рублях' },
    { id: 'str', align: 'right',  label: 'STR', tooltip: 'Save Through Rate - конверсия из охвата в добавления' },
    { id: 'cplCpsRate', align: 'right',  label: 'CPS/CPL', tooltip: 'Соотношение стоимостей добавления и прослушивания (сколько людей, нажавших на плей, добавили трек себе)' },
    { id: 'audienceCount', align: 'right',  label: 'Аудитория', tooltip: 'Размер аудитории сегмента с учетом его настроек' },
    { id: 'adUrl', align: 'right',  label: 'Объявление', tooltip: 'Ссылка на объявление в рекламном кабинете ВК' },
    { id: 'postUrl', align: 'right',  label: 'Пост', tooltip: 'Ссылка на пост в ВК' },
]


const statusIcons = [

    <Tooltip title='Остановлено'>
        <TableCell align="right">
            <StopIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущено'>
        <TableCell align="right">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Удалено'>
        <TableCell align="right">
            <DeleteIcon color='disabled'/>
        </TableCell>
    </Tooltip>,

]


const approvedIcons = [

    <Tooltip title='Не проходило модерацию'>
        <TableCell align="right">
            <HelpIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='На модерации'>
        <TableCell align="right">
            <HourglassFullIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Одобрено'>
        <TableCell align="right">
            <DoneIcon color='action'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Отклонено'>
        <TableCell align="right">
            <CloseIcon color='disabled'/>
        </TableCell>
    </Tooltip>,

]


export default function AdsTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('saves');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState(props.rows);

    const { handleDownload, handleDelete } = props
    const allRows = props.rows

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
        const filteredRows = allRows.filter(row => row.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
        setRows(filteredRows)
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <FilterToolbar handleChange={handleChangeFilter} placeholder='введи название сегмента для поиска'/>
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
                                            selected={row.name === '* КАМПАНИЯ В ЦЕЛОМ *'}
                                        >
                                            <TableCell align="left">{row.name}</TableCell>
                                            { row.approved ? approvedIcons[row.approved] : row.approved === 0 ? approvedIcons[0] : <TableCell /> }
                                            { row.status ? statusIcons[row.status] : row.status === 0 ? statusIcons[0] : <TableCell /> }
                                            <TableCell align="right">{spacedNumber(row.spent)}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.reach)}</TableCell>
                                            <TableCell align="right">{row.cpm}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.listens)}</TableCell>
                                            <TableCell align="right">{row.cpl}</TableCell>
                                            <TableCell align="right">{`${row.ltr} %`}</TableCell>
                                            <TableCell align="right">{spacedNumber(row.saves)}</TableCell>
                                            <TableCell align="right">{row.cps}</TableCell>
                                            <TableCell align="right">{`${row.str} %`}</TableCell>
                                            <TableCell align="right">{ row.cplCpsRate }</TableCell>
                                            <TableCell align="right">{spacedNumber(row.audienceCount)}</TableCell>

                                            {
                                                row.adUrl ? <Tooltip title='Открыть объявление в ВК'>
                                                                <TableCell align="right" onClick={() => {handleClick(row.adUrl)}}>
                                                                    <LinkIcon color='secondary' style={{cursor: 'pointer'}}/>
                                                                </TableCell>
                                                            </Tooltip> : <TableCell />
                                            }

                                            {
                                                row.postUrl ? <Tooltip title='Открыть пост в ВК'>
                                                                    <TableCell align="right" onClick={() => {handleClick(row.postUrl)}} >
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
                                Выгрузить статистику
                            </Button>
                        </Grid>
                        <Grid item xs={9} />
                        <Grid item align='right'  xs={3}>
                            <Button fullWidth variant='contained' color='inherit' onClick={handleDelete} >
                                Удалить кампанию
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
}
