import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';


const ChartsPageForm = (props) => {
    const [state, setState] = React.useState({
        artist: undefined,
        title: undefined,
        dateFrom: new Date(),
        dateTo: new Date(),

        qError: false,
        dateFromError: false,
        dateToError: false
    })

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setState({
            ...state,
            [name]: value,
        })
    }

    const checkForm = () => {
        let [qError, dateFromError, dateToError] = [false, false, false]

        if (!state.artist && !state.title) {qError = true}
        if (!state.dateFrom || new Date(state.dateFrom) > new Date()) {dateFromError = true}
        if (!state.dateTo || new Date(state.dateTo) > new Date()) {dateToError = true}

        setState({...state, qError, dateFromError, dateToError})
        startSearch(qError, dateFromError, dateToError)
    }

    const startSearch = (qError, dateFromError, dateToError) => {

        if (!qError && !dateFromError && !dateToError) {
            props.startSearch(state)
        }
    }

    const handleDateFromChange = (date) => {
        setState({...state, dateFrom: date});
    };

    const handleDateToChange = (date) => {
        setState({...state, dateTo: date});
    };

    return (

        <Grid container spacing={3} alignItems='center' >

            <Grid item xs={3} >
                <TextField
                    error={state.qError}
                    id="artist"
                    name='artist'
                    label="Исполнитель"
                    fullWidth
                    autoComplete="artist"
                    onChange={handleChange}
                    helperText="Исполнитель релиза"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={3} >
                <TextField
                    error={state.qError}
                    id="title"
                    name='title'
                    label="Название"
                    fullWidth
                    autoComplete="title"
                    onChange={handleChange}
                    helperText="Название релиза"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={6} />

            <Grid item xs={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        error={state.dateFromError}
                        fullWidth
                        disableToolbar
                        variant="inline"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="dateFrom-picker-inline"
                        label="Дата от"
                        value={state.dateFrom}
                        onChange={handleDateFromChange}
                        KeyboardButtonProps={{'aria-label': 'change date'}}
                    />
                </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        error={state.dateToError}
                        fullWidth
                        disableToolbar
                        variant="inline"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="dateTo-picker-inline"
                        label="Дата до"
                        value={state.dateTo}
                        onChange={handleDateToChange}
                        KeyboardButtonProps={{'aria-label': 'change date'}}
                    />
                </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs />

            <Grid item xs={3}>
                <Button variant='contained'
                        color='secondary'
                        fullWidth
                        onClick={checkForm}
                >
                    Искать
                </Button>
            </Grid>

        </Grid>
    )
}


export default ChartsPageForm