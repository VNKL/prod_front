import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from "@material-ui/core/Grid";


const AdsPageSkeleton = () => {
    return (
        <Grid container spacing={4} alignItems='center'>

            <Grid item >
                <Skeleton variant='circle' height={100} width={100}/>
            </Grid>

            <Grid item xs={4} sm={4}>
                <Skeleton variant='rect' height={50}/>
            </Grid>

            <Grid item xs />

            <Grid item xs={2} sm={2} align='right'>
                <Skeleton variant='rect' height={50}/>
            </Grid>

            <Grid item xs={12} sm={12} align='right'>
                <Skeleton variant='rect' height={530}/>
            </Grid>

            <Grid item xs={2} sm={2} align='left'>
                <Skeleton variant='rect' height={50}/>
            </Grid>

            <Grid item xs />

            <Grid item xs={2} sm={2} align='right'>
                <Skeleton variant='rect' height={50}/>
            </Grid>



        </Grid>
    )
}


export default AdsPageSkeleton