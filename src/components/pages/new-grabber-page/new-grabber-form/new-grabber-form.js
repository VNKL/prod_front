import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import FormHelperText from "@material-ui/core/FormHelperText";


const NewGrabberForm = (props) => {
    const [state, setState] = React.useState({
        groupUrl: undefined,
        withAudio: true,
        adsOnly: true,
        withAds: true,
        dateFrom: new Date(),
        dateTo: new Date(),

        groupUrlError: false,
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
        let [groupUrlError, dateFromError, dateToError] = [false, false, false]

        if (!state.groupUrl || state.groupUrl.indexOf('https://vk.com/') === -1) {groupUrlError = true}
        if (!state.dateFrom || new Date(state.dateFrom) > new Date()) {dateFromError = true}
        if (!state.dateTo || new Date(state.dateTo) > new Date()) {dateToError = true}

        setState({...state, groupUrlError, dateFromError, dateToError})
        startGrabber(groupUrlError, dateFromError, dateToError)
    }

    const startGrabber = (groupUrlError, dateFromError, dateToError) => {

        if (!groupUrlError && !dateFromError && !dateToError) {
            props.startGrabber(state)
        }
    }

    const changeWithAudio = () => {
        setState({...state, withAudio: !state.withAudio})
    }

    const changeAdsOnly = () => {
        setState({...state, adsOnly: !state.adsOnly})
    }

    const changeWithAds = () => {
        setState({...state, withAds: !state.withAds})
    }

    const handleDateFromChange = (date) => {
        setState({...state, dateFrom: date});
    };

    const handleDateToChange = (date) => {
        setState({...state, dateTo: date});
    };

    return (

        <Grid container spacing={3} alignItems='center' >

            <Grid item xs={12} >
                <TextField
                    error={state.groupUrlError}
                    id="groupUrl"
                    name='groupUrl'
                    label="Сообщество"
                    fullWidth
                    autoComplete="artist-url"
                    onChange={handleChange}
                    placeholder="https://vk.com/********"
                    helperText="Ссылка на сообщество в ВК"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>


            <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            error={state.dateFromError}
                            disableToolbar
                            variant="inline"
                            format="dd.MM.yyyy"
                            margin="normal"
                            id="dateFrom-picker-inline"
                            label="Дата постов от"
                            value={state.dateFrom}
                            onChange={handleDateFromChange}
                            KeyboardButtonProps={{'aria-label': 'change date'}}
                        />
                </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        error={state.dateToError}
                        disableToolbar
                        variant="inline"
                        format="dd.MM.yyyy"
                        margin="normal"
                        id="dateTo-picker-inline"
                        label="Дата постов до"
                        value={state.dateTo}
                        onChange={handleDateToChange}
                        KeyboardButtonProps={{'aria-label': 'change date'}}
                    />
                </MuiPickersUtilsProvider>
            </Grid>


            <Grid item xs={12} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch
                            checked={state.withAudio}
                            onChange={changeWithAudio}
                            name="withAudio"
                        />}
                        label="Только с аудио"
                    />
                    <FormHelperText>Посты только с аудио и плейлистами во вложениях</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch
                            checked={state.adsOnly}
                            onChange={changeAdsOnly}
                            name="adsOnly"
                        />}
                        label="Только промо-посты"
                    />
                    <FormHelperText>Только посты, помеченные как рекламные</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch
                            checked={state.withAds}
                            onChange={changeWithAds}
                            name="withAds"
                        />}
                        label="Включая промо-посты"
                    />
                    <FormHelperText>Включая посты, помеченные как рекламные</FormHelperText>
                </FormControl>
            </Grid>


            <Grid item xs>
                <Button variant='contained'
                        color='secondary'
                        fullWidth
                        onClick={checkForm}
                >
                    Запустить
                </Button>
            </Grid>

        </Grid>
    )
}


export default NewGrabberForm