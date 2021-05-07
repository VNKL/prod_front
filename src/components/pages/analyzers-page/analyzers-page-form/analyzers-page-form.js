import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const AnalyzersPageForm = (props) => {
    const [state, setState] = React.useState({
        artistUrl: undefined,
        artistUrlError: false,
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
        if (!state.artistUrl || state.artistUrl.indexOf('https://vk.com/artist/') === -1) {artistUrlError = true}

        setState({...state, artistUrlError: artistUrlError})
        startAnal(artistUrlError)
    }

    const startAnal = (qError, dateFromError, dateToError) => {

        if (!qError && !dateFromError && !dateToError) {
            props.startAnal(state)
        }
    }

    return (

        <Grid container spacing={3} alignItems='center' >

            <Grid item xs={3} >
                <TextField
                    error={state.artistUrlError}
                    id="artistUrl"
                    name='artistUrl'
                    label="Карточка артиста"
                    fullWidth
                    autoComplete="artistUrl"
                    placeholder="https://vk.com/artist/*********"
                    onChange={handleChange}
                    helperText="Ссылка на карточку артиста в ВК"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>

            <Grid item xs={2}>
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


export default AnalyzersPageForm