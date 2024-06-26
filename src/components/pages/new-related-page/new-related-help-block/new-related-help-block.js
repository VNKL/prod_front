import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            padding: theme.spacing(3),
        },
    },
}));


const NewRelatedHelpBlock = () => {

    const classes = useStyles()

    return (
        <Grow in>
            <Paper className={classes.paper} elevation={5}>
                <Typography component='span' variant='caption'>
                    <p>
                        <b>Карточка артиста. </b>
                        Ссылка на карточку артиста в ВК. Картчока должна иметь блок "Вам могут понравиться".
                        Начиная с этой карточки будет выполнен рекурсивный проход по похожим артистам.
                    </p>
                    <p>
                        <b>Рекурсия. </b>
                        Уровень глубины кроличьей норы, в которую будет опускаться задача, проходя по похожим артистам
                        похожих артистов, похожих на самого первого. 1 - будут проанализированы только похожие на
                        артиста из заданной карточки. 2 - похожие на похожих. 3 - похожие похожих на похожих.
                    </p>
                    <p>
                        <b>Релизы. </b>
                        Количество последних релизов каждого артиста, которые будут использоваться при его анализе.
                    </p>
                    <p>
                        <b>Прослушивания. </b>
                        Минимальный и максимальный порог фильтра артистов по медианному количеству прослушиваний на
                        последних релизных плейлистах.
                    </p>
                    <p>
                        <b>Дней прошло. </b>
                        Количество дней, прошедших от даты последнего релиза артиста до даты анализа.
                        Параметр, используемый для отсечения артистов, которые давно не выпускали релизы.
                        Данный фильтр пройдут артисты, чей последний релиз выпущен не более заданного количества
                        дней назад.
                    </p>
                    <p>
                        <b>Медиана дней. </b>
                        Медиана количества дней, которые проходят между релизами артиста. Для анализа берется
                        заданное выше последнее количество релизов артиста. Параметр, используемый для отсечения
                        непостоянных в плане частоты релизов артистов. Данный фильтр пройдут артисты, медианная
                        частота релизов которых не превышает заданную.
                    </p>
                </Typography>
            </Paper>
        </Grow>
    )
}

export default NewRelatedHelpBlock