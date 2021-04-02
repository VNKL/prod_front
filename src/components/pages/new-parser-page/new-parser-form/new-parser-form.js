import React from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";


const parsers = [
    {methodName: 'Исполнитель', methodApi: 'artist_url'},
    {methodName: 'Трек', methodApi: 'track_name'},
    {methodName: 'Аудиозаписи сообщества', methodApi: 'group'},
    {methodName: 'Аудиозаписи плейлиста', methodApi: 'playlist_url'},
    {methodName: 'Аудиозаписи поста', methodApi: 'post'},
    {methodName: 'Поиск но повостям', methodApi: 'newsfeed'},
    {methodName: 'Чарт ВК', methodApi: 'chart'},
    {methodName: 'Новинки ВК', methodApi: 'new_releases'},
]

const placeholders = {
    artist_url: 'https://vk.com/artist/***********',
    track_name: 'Исполнитель - Название',
    group: 'https://vk.com/********',
    playlist_url: 'https://vk.com/music/album/******_******_**********',
    post: 'https://vk.com/wall******_******',
    newsfeed: 'panamera',
    chart: null,
    new_releases: null
}


const NewParserForm = (props) => {
    const [state, setState] = React.useState({
        method: undefined,
        param: undefined,
        countOnly: true,
        placeholder: null,
        methodError: false,
        paramError: false
    })

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setState({
            ...state,
            [name]: value,
            placeholder: placeholders[value],
        })
    }

    const changeCountOnly = () => {
        setState({
            ...state,
            countOnly: !state.countOnly
        })
    }

    const checkForm = () => {
        let [methodError, paramError] = [false, false]

        if (!state.method) {methodError = true}
        if (!state.param && state.method !== 'chart' && state.method !== 'new_releases') {paramError = true}

        setState({...state, methodError, paramError})
        startParser(methodError, paramError)
    }

    const startParser = (methodError, paramError) => {
        if (!methodError && !paramError) {
            props.startParser(state)
        }
    }

    return (
        <Grid container spacing={3} >


            <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Метод парсинга</InputLabel>
                    <NativeSelect
                        error={state.methodError}
                        id='method'
                        name='method'
                        value={state.ageDisclaimer}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {parsers.map((parser, idx) => {
                            return <option value={parser.methodApi} key={idx}>{ parser.methodName }</option>
                        })}
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs />


            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.paramError}
                    id="param"
                    name='param'
                    label="Параметр"
                    fullWidth
                    autoComplete="target-cost"
                    onChange={handleChange}
                    helperText={state.placeholder ? 'Обязательно' : 'Оставь пустым'}
                    placeholder={state.placeholder}
                    InputLabelProps={{shrink: !!state.placeholder || !!state.param}}
                />
            </Grid>

            <Grid item />


            <Grid item xs={12} sm={12} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch checked={state.countOnly}
                                         onChange={changeCountOnly}
                                         name="finishAutomatically"
                        />}
                        label="Только количество"
                    />
                    <FormHelperText>Сбор базы по добавлениям</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={6}>
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


export default NewParserForm