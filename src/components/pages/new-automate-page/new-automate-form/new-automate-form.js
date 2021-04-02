import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
}));


const NewAutomateForm = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        campaign: undefined,
        campaignError: false,
        targetCost: undefined,
        targetCostError: false,
        type: 1,
        typeError: false,
        startTomorrow: false,
        finishAutomatically: false,

    });

    const { campaigns } = props

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    const checkForm = () => {
        let [campaignError, targetCostError, typeError] = [false, false, false]

        if (!state.campaign) {campaignError = true}
        if (!state.targetCost || isNaN(state.targetCost)) {targetCostError = true}
        if (!state.type || isNaN(state.type)) {typeError = true}

        setState({...state, campaignError, targetCostError, typeError})
        startAutomate(campaignError, targetCostError, typeError)
    }

    const startAutomate = (campaignError, targetCostError, typeError) => {
        if (!campaignError && !targetCostError && !typeError) {
            props.startAutomate(state)
        }
    }

    const changeStartDay = () => {
        setState({
            ...state,
            startTomorrow: !state.startTomorrow
        })
    }

    const changeFinishDay = () => {
        setState({
            ...state,
            finishAutomatically: !state.finishAutomatically
        })
    }

    const loadCampCover = () => {
        const selectedCamp = campaigns.filter(camp => camp.campaignId.toString() === state.campaign)[0]
        if (selectedCamp) {
            return <Avatar src={selectedCamp.cover} alt={selectedCamp.name} className={classes.large} />
        } else {
            return <Avatar src='https://vk.com/images/community_200.png?ava=1' alt='groupImg' className={classes.large} />
        }
    }

    return (

        <Grid container spacing={3} >


            <Grid item xs={6} sm={6}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Кампания</InputLabel>
                    <NativeSelect
                        error={state.campaignError}
                        id='campaign'
                        name='campaign'
                        value={state.ageDisclaimer}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {campaigns.map((campaign, idx) => {
                            return <option value={campaign.campaignId} key={idx}>{ `${campaign.name} (${campaign.dateFormatted})` }</option>
                        })}
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={6} align='left'>
                {loadCampCover()}
            </Grid>


            <Grid item xs={3} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="type-native-helper">Параметр</InputLabel>
                    <NativeSelect
                        id='type'
                        name='type'
                        value={state.type}
                        error={state.typeError}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {[
                            <option value={0} key={0}> Стоимость прослушивания </option>,
                            <option value={1} key={1}> Стоимость добавления </option>
                        ]}
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={3} sm={3}>
                <TextField
                    error={state.targetCostError}
                    id="targetCost"
                    name='targetCost'
                    label="Значение"
                    fullWidth
                    type='number'
                    autoComplete="target-cost"
                    onChange={handleChange}
                    helperText="Обязательно"
                />
            </Grid>

            <Grid item xs={12} sm={12} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch checked={state.startTomorrow}
                                         onChange={changeStartDay}
                                         name="startTomorrow"
                        />}
                        label="Завтра в 00:00"
                    />
                    <FormHelperText>Запуск автоматизации</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch checked={state.finishAutomatically}
                                         onChange={changeFinishDay}
                                         name="finishAutomatically"
                        />}
                        label="23:59 в день запуска"
                    />
                    <FormHelperText>Остановка автоматизации</FormHelperText>
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

    );
}


export default NewAutomateForm