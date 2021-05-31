import React from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const ticketTypeArray = ['Треки', 'Исполнители']


const NewListenersForm = (props) => {
    const [state, setState] = React.useState({
        ticketName: '',
        ticketType: 'Треки',
        nLast: 30,
        userIds: '',

        ticketNameError: false,
        ticketTypeError: false,
        nLastError: false,
        userIdsError: false,
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
        let ticketNameError = false
        let ticketTypeError = false
        let nLastError = false
        let userIdsError = false

        let userIdsArray = state.userIds.split('\n').filter(item => !isNaN(parseInt(item)))
        if (userIdsArray.length > 5000) {userIdsArray = userIdsArray.slice(0, 5000)}

        if (!state.ticketName) {ticketNameError = true}
        if (!state.ticketType) {ticketTypeError = true}
        if (isNaN(parseInt(state.nLast)) || parseInt(state.nLast) > 100) {nLastError = true}
        if (userIdsArray.length === 0 || userIdsArray.length > 5000) {userIdsError = true}

        setState({...state, ticketNameError, ticketTypeError, nLastError, userIdsError})
        startListeners(ticketNameError, ticketTypeError, nLastError, userIdsError, userIdsArray)
    }

    const startListeners = (ticketNameError, ticketTypeError, nLastError, userIdsError, userIdsArray) => {

        if (!ticketNameError && !ticketTypeError && !nLastError && !userIdsError && userIdsArray.length > 0) {
            const settings = state
            settings.userIdsArray = userIdsArray
            props.startListeners(settings)
        }
    }

    return (

        <Grid container spacing={3} alignItems='center' >

            <Grid item xs={12} >
                <TextField
                    error={state.ticketNameError}
                    id="ticketName"
                    name='ticketName'
                    label="Название задачи"
                    fullWidth
                    autoComplete="ticket-name"
                    onChange={handleChange}
                />
            </Grid>


            <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="recurse-native-helper">Параметр</InputLabel>
                    <NativeSelect
                        error={state.ticketTypeError}
                        id='ticketType'
                        name='ticketType'
                        autoComplete='ticket-type'
                        value={state.ticketType}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {ticketTypeArray.map((item) => <option value={item} key={item}>{item}</option>)}
                    </NativeSelect>
                    <FormHelperText>Параметр анализа</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.nLastError}
                    value={state.nLast}
                    id="nLast"
                    name='nLast'
                    label="Добавления"
                    fullWidth
                    autoComplete='nLast'
                    onChange={handleChange}
                    type='number'
                    helperText="Последние добавления"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={12} sm={12}>
                <TextField
                    error={state.userIdsError}
                    id="userIds"
                    name='userIds'
                    label="Пользователи"
                    fullWidth
                    onChange={handleChange}
                    multiline
                    rows={8}
                    variant="outlined"
                    helperText="По одному id пользователя в строке"
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


export default NewListenersForm