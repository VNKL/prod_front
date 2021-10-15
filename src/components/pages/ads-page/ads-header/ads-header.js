import React from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";


const AdsHeader = (props) => {

    const {updateStats, updateSegmentSizes, openCampaignInCabinet, renameCampaign, handleChange} = props

    return (
        <Grid container alignItems='center' spacing={3}>

            <Grid item >
                <Avatar src={props.cover} alt='cover' style={{width: 100, height: 100}} />
            </Grid>

            <Grid item xs>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant='h5' style={{cursor: 'pointer'}} onClick={openCampaignInCabinet}>
                            {props.name}
                        </Typography>
                    </Grid>
                    <Grid item >
                        <Button fullWidth variant='outlined' onClick={renameCampaign} >
                            Ок
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="campRename"
                            name='campRename'
                            fullWidth
                            autoComplete="post-url"
                            onChange={handleChange}
                            placeholder="переименовать кампанию"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={6} sm={6}>
                <Grid container spacing={1}>
                    <Grid item xs={9} />
                    <Grid item xs={3} align='right'>
                        <Button fullWidth variant='contained' color='secondary' onClick={updateStats} >
                            Обновить статистику
                        </Button>
                    </Grid>
                    <Grid item xs={9} />
                    <Grid item xs={3} align='right'>
                        <Button fullWidth variant='contained' color='inherit' onClick={updateSegmentSizes} >
                            Обновить аудитории
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}


export default AdsHeader