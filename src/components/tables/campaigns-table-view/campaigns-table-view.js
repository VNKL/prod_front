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
import DeleteIcon from '@material-ui/icons/Delete';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ErrorIcon from '@material-ui/icons/Error';
import PauseIcon from '@material-ui/icons/Pause';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import {dateStrFromParam, spacedNumber} from "../../../services/api-service";
import {useStyles, getComparator, stableSort, EnhancedTableHead, FilterToolbar} from "../table-functions";


const headCells = [
    { id: 'cover', align: 'left', label: '', tooltip: 'Обложка продвигаемого релиза' },
    { id: 'artist', align: 'left', label: 'Исполнитель', tooltip: 'Исполнитель (исполнители) продвигаемого релиза' },
    { id: 'title', align: 'left', label: 'Название', tooltip: 'Название продвигаемого релиза' },
    { id: 'status', align: 'right', label: 'Статус', tooltip: 'Статус кампании' },
    { id: 'isAutomate', align: 'right', label: 'Авт.', tooltip: 'Автоматизация ведения кампании' },
    { id: 'spent', align: 'right',  label: 'Расход', tooltip: 'Потраченная сумма в рублях' },
    { id: 'reach', align: 'right',  label: 'Показы', tooltip: 'Показы объявлений' },
    { id: 'cpm', align: 'right',  label: 'CPM', tooltip: 'Стоимость тысячи показов в рублях' },
    { id: 'listens', align: 'right',  label: 'Прослуш.', tooltip: 'Прослушивания на плейлистах (не равно стримы)' },
    { id: 'cpl', align: 'right',  label: 'CPL', tooltip: 'Cost Per Listen - стоимость одного прослушивания в рублях' },
    { id: 'ltr', align: 'right',  label: 'LTR', tooltip: 'Listen Through Rate - конверсия из показов в прослушивания' },
    { id: 'saves', align: 'right',  label: 'Добавл.', tooltip: 'Сохранения аудио и плейлистов из объявлений в аудиозаписях пользователей' },
    { id: 'cps', align: 'right',  label: 'CPS', tooltip: 'Cost Per Save - стоимость одного сохранения в рублях' },
    { id: 'str', align: 'right',  label: 'STR', tooltip: 'Save Through Rate - конверсия из показов в добавления' },
    { id: 'cplCpsRate', align: 'right',  label: 'CPS/CPL', tooltip: 'Соотношение стоимостей добавления и прослушивания (сколько людей, нажавших на плей, добавили трек себе)' },
    { id: 'audienceCount', align: 'right',  label: 'Аудитория', tooltip: 'Сумма размеров аудиторий всех сегментов кампании' },
    { id: 'date', align: 'right',  label: 'Дата', tooltip: 'Дата создания кампании' },
]


const icons = [

    <Tooltip title='Остановлена' >
        <TableCell align="right" >
            <StopIcon color='disabled' />
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запущена' >
        <TableCell align="right">
            <PlayArrowIcon color='secondary'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Архивирована'>
        <TableCell align="right" >
            <DeleteIcon color='disabled'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Ошибка. Невозможно создать объявления с заданными настройками.
                    Запусти кампанию с другими настройками или другим референсным постом.'>
        <TableCell align="right" >
            <ErrorIcon color='error'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Ожидает очереди'>
        <TableCell align="right" >
            <PauseIcon color='disabled'/>
        </TableCell>
    </Tooltip>,

    <Tooltip title='Запускается' >
        <TableCell align="right">
            <PlayArrowIcon color='disabled'/>
        </TableCell>
    </Tooltip>,

]


export default function CampaignsTableView(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('date');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState(props.rows);

    const allRows = props.rows

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

    const handleChangeFilter = (event) => {
        const value = event.target.value
        const filteredRows = allRows.filter(row => row.title.toLowerCase().indexOf(value.toLowerCase()) > -1)
        setRows(filteredRows)
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <FilterToolbar handleChange={handleChangeFilter} placeholder='введи название релиза для поиска'/>
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
                                                <Link component={RouterLink} to={`/ads/${row.campaignId}`} underline='none'>
                                                    <Avatar src={row.cover} alt='cover' style={coverSize} />
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/ads/${row.campaignId}`} underline='none'>
                                                    {row.artist}
                                                </Link>
                                            </TableCell>

                                            <TableCell align="left" >
                                                <Link component={RouterLink} to={`/ads/${row.campaignId}`} underline='none'>
                                                    {row.title}
                                                </Link>
                                            </TableCell>

                                            { icons[row.status] }
                                            { icons[row.isAutomate] }

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
                                            <TableCell align="right">{dateStrFromParam(row.date)}</TableCell>

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
