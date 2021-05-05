import React from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const recurseArray = [0, 1, 2]


const NewRelatedForm = (props) => {
    const [state, setState] = React.useState({
        artistUrl: undefined,
        recurse: 0,
        nReleases: 5,
        listensMin: 25000,
        listensMax: 45000,
        lastDays: 60,
        medianDays: 60,

        artistUrlError: false,
        recurseError: false,
        nReleasesError: false,
        listensMinError: false,
        listensMaxError: false,
        lastDaysError: false,
        medianDaysError: false,
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
        let artistUrlError = false
        let recurseError = false
        let nReleasesError = false
        let listensMinError = false
        let listensMaxError = false
        let lastDaysError = false
        let medianDaysError = false

        if (!state.artistUrl || state.artistUrl.indexOf('https://vk.com/artist/') === -1) {artistUrlError = true}
        if (!state.recurse.toString()) {recurseError = true}
        if (!parseInt(state.nReleases)) {nReleasesError = true}
        if (!parseInt(state.listensMin)) {listensMinError = true}
        if (!parseInt(state.listensMax)) {listensMaxError = true}
        if (!parseInt(state.lastDays)) {lastDaysError = true}
        if (!parseInt(state.medianDays)) {medianDaysError = true}

        setState({
            ...state,
            artistUrlError,
            recurseError,
            nReleasesError,
            listensMinError,
            listensMaxError,
            lastDaysError,
            medianDaysError})

        startRelated(artistUrlError, recurseError, nReleasesError, listensMinError,
                     listensMaxError, lastDaysError, medianDaysError)
    }

    const startRelated = (artistUrlError, recurseError, nReleasesError, listensMinError,
                          listensMaxError, lastDaysError, medianDaysError) => {

        if (!artistUrlError && !recurseError && !nReleasesError && !listensMinError &&
            !listensMaxError && !lastDaysError && !medianDaysError) {
            props.startRelated(state)
        }
    }

    return (

        <Grid container spacing={3} alignItems='center' >

            <Grid item xs={12} >
                <TextField
                    error={state.artistUrlError}
                    id="artistUrl"
                    name='artistUrl'
                    label="Карточка артиста"
                    fullWidth
                    autoComplete="artist-url"
                    onChange={handleChange}
                    placeholder="https://vk.com/artist/********"
                    helperText="Ссылка на карточку артиста в ВК"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>


            <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="recurse-native-helper">Рекурсия</InputLabel>
                    <NativeSelect
                        error={state.recurseError}
                        id='recurse'
                        name='recurse'
                        autoComplete='recurse'
                        value={state.recurse}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {recurseArray.map((level) => <option value={level} key={level}>{level}</option>)}
                    </NativeSelect>
                    <FormHelperText>Уровень глубины</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.nReleasesError}
                    value={state.nReleases}
                    id="nReleases"
                    name='nReleases'
                    label="Релизы"
                    fullWidth
                    autoComplete='nReleases'
                    onChange={handleChange}
                    type='number'
                    helperText="Количество для анализа"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>


            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.listensMinError}
                    value={state.listensMin}
                    id="listensMin"
                    name='listensMin'
                    label="Прослушивания"
                    fullWidth
                    autoComplete='listensMin'
                    onChange={handleChange}
                    type='number'
                    helperText="Минимальный порог"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.listensMaxError}
                    value={state.listensMax}
                    id="listensMax"
                    name='listensMax'
                    label="Прослушивания"
                    fullWidth
                    autoComplete='listensMax'
                    onChange={handleChange}
                    type='number'
                    helperText="Максимальный порог"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>


            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.lastDaysError}
                    value={state.lastDays}
                    id="lastDays"
                    name='lastDays'
                    label="Дней прошло"
                    fullWidth
                    autoComplete='lastDays'
                    onChange={handleChange}
                    type='number'
                    helperText="От последнего релиза"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.medianDaysError}
                    value={state.medianDays}
                    id="medianDays"
                    name='medianDays'
                    label="Медиана дней"
                    fullWidth
                    autoComplete='medianDays'
                    onChange={handleChange}
                    type='number'
                    helperText="Между релизами"
                    InputLabelProps={{shrink: true}}
                />
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


export default NewRelatedForm