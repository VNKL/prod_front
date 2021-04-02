import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import 'fontsource-roboto'


const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const NewCampaignFormView = (props) => {
    const {state, cabinets, groups, changeCabinet, startCampaign,
           handleChange, changeRelatedArtists, changeMusicFilter, changeBoomFilter,
           handleRetarget, handleRetargetDelete} = props

    const classes = useStyles();

    const loadGroupAvatar = () => {
        const selectedGroup = groups.filter(group => group.groupId.toString() === state.group)[0]
        if (selectedGroup) {
            return <Avatar src={selectedGroup.groupAvaUrl} alt={selectedGroup.groupName} className={classes.large} />
        } else {
            return <Avatar src='https://vk.com/images/community_200.png?ava=1' alt='groupImg' className={classes.large} />
        }
    }

    const startText = () => {
        let text = `Запустить`
        if (state.count) {
            text = `${text} (${state.count})`
        }
        return text
    }

    const cabinetsIds = []

    return (

        <Grid container spacing={3} alignItems='center' >


            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.postUrlError}
                    id="postUrl"
                    name='postUrl'
                    label="Пост"
                    fullWidth
                    autoComplete="post-url"
                    onChange={handleChange}
                    placeholder="https://vk.com/wall*******_*******"
                    helperText="Ссылка на референсный пост"
                    InputLabelProps={{shrink: true}}
                />

            </Grid>

            <Grid item xs={6} sm={6}>
                <TextField
                    error={state.budgetError}
                    id="budget"
                    name='budget'
                    label="Бюджет"
                    fullWidth
                    autoComplete='budget'
                    onChange={handleChange}
                    placeholder="10000"
                    type='number'
                    helperText="Обязательно (в рублях)"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>


            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Возраст от</InputLabel>
                    <NativeSelect
                        id='ageFrom'
                        name='ageFrom'
                        autoComplete='age-from'
                        value={state.ageFrom}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {state.ageFromArray.map((age) => <option value={age} key={age}>{age}</option>)}
                    </NativeSelect>
                    <FormHelperText>Включительно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Возраст до</InputLabel>
                    <NativeSelect
                        id='ageTo'
                        name='ageTo'
                        autoComplete='age-to'
                        value={state.ageTo}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {state.ageToArray.map((age) => <option value={age} key={age}>{age}</option>)}
                    </NativeSelect>
                    <FormHelperText>Включительно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Дисклеймер</InputLabel>
                    <NativeSelect
                        id='ageDisclaimer'
                        name='ageDisclaimer'
                        value={state.ageDisclaimer}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        <option value={1} key={1}>0+</option>
                        <option value={2} key={2}>6+</option>
                        <option value={3} key={3}>14+</option>
                        <option value={4} key={4}>16+</option>
                        <option value={5} key={5}>18+</option>
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Пол</InputLabel>
                    <NativeSelect
                        id='sex'
                        name='sex'
                        value={state.sex}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        <option value='all' key={1}>Любой</option>
                        <option value='male' key={2}>Мужской</option>
                        <option value='female' key={3}>Женский</option>
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>


            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Кабинет</InputLabel>
                    <NativeSelect
                        error={state.cabinetError}
                        id='cabinet'
                        name='cabinet'
                        value={state.cabinet}
                        onChange={changeCabinet}
                    >
                        <option aria-label="None" value="" />
                        {
                            cabinets.map((cabinet, index) => {
                                const cabId = cabinet.cabinetId
                                const check = cabinetsIds.includes(cabId)
                                let cab = null
                                if (!check) {
                                    cabinetsIds.push(cabId)
                                    cab = <option value={cabId}
                                                  key={index}>{cabinet.cabinetName}</option>
                                }
                                return cab
                            })
                        }
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Клиент</InputLabel>
                    <NativeSelect
                        error={state.clientError}
                        id='client'
                        name='client'
                        value={state.client}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {cabinets.map((cabinet, index) => {
                            const cabId = state.cabinet
                            let client = undefined
                            if (cabId === cabinet.cabinetId.toString()) {
                                client = <option value={cabinet.clientId}
                                                 key={index}>{cabinet.clientName}</option>
                            }
                            return client
                        })}
                    </NativeSelect>
                    <FormHelperText>{state.agencyHelpText}</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="age-native-helper">Группа ВК</InputLabel>
                    <NativeSelect
                        error={state.groupError}
                        id='group'
                        name='group'
                        value={state.group}
                        onChange={handleChange}
                    >
                        <option aria-label="None" value="" />
                        {groups.map((group) => {
                            return <option value={group.groupId} key={group.groupId}>{group.groupName}</option>
                        })}
                    </NativeSelect>
                    <FormHelperText>Обязательно</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3} align='center' >
                {loadGroupAvatar()}
            </Grid>


            <Grid item xs={12} sm={6}>
                <TextField
                    id="musicians"
                    name='musicians'
                    label="Слушатели артистов"
                    fullWidth
                    onChange={handleChange}
                    multiline
                    rows={8}
                    variant="outlined"
                    helperText="По одному артисту в строке"
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <TextField
                    id="groupsActive"
                    name='groupsActive'
                    label="Активность в сообществах"
                    fullWidth
                    onChange={handleChange}
                    multiline
                    rows={8}
                    variant="outlined"
                    helperText="По одной ссылке в строке"
                />
            </Grid>


            <Grid item xs={6} sm={3} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch
                            checked={state.relatedArtists}
                            onChange={changeRelatedArtists}
                            name="relatedArtists"
                        />}
                        label="Автоподбор"
                    />
                    <FormHelperText>Аудитории для таргета</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch
                            checked={state.musicFilter}
                            onChange={changeMusicFilter}
                            name="relatedArtists"
                        />}
                        label="Музыка"
                    />
                    <FormHelperText>Интересы и поведение</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3} >
                <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                        control={<Switch
                            checked={state.boomFilter}
                            onChange={changeBoomFilter}
                            name="relatedArtists"
                        />}
                        label="ВООМ"
                    />
                    <FormHelperText>Приложения и сайты</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
                <TextField
                    id="emptyAds"
                    name='emptyAds'
                    label="Количество"
                    fullWidth
                    autoComplete='budget'
                    onChange={handleChange}
                    placeholder="0"
                    type='number'
                    helperText="Пустые сегменты"
                    InputLabelProps={{shrink: true}}
                />
            </Grid>


            <Grid item xs={9} sm={9} >
                <FormControl fullWidth>
                    <InputLabel id="mutiple-chip-label">Ретаргетинг</InputLabel>
                    <Select
                        labelId="mutiple-chip-label"
                        id="mutiple-chip"
                        multiple
                        value={state.retargetNames}
                        onChange={handleRetarget}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value, index) => (
                                    <Chip key={index} label={value} className={classes.chip}
                                          onDelete={() => handleRetargetDelete(value)}
                                          onMouseDown={(event) => {
                                              event.stopPropagation();
                                          }}/>
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {state.retarget.map((retarget, index) => (
                            <MenuItem key={index}
                                      value={retarget.retargetName}
                            >
                                {`${retarget.retargetName} | ${retarget.audienceCount}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={3} sm={3} >
                <Button variant='contained'
                        color='secondary'
                        fullWidth
                        onClick={startCampaign}
                >
                    {startText()}
                </Button>
            </Grid>


        </Grid>
    )
}


export default NewCampaignFormView
