import React from "react";
import Grid from "@material-ui/core/Grid";
import Skeleton from '@material-ui/lab/Skeleton';


const smallHeight = 60


const SkeletonRectSmall = () => {
    return <Skeleton variant='rect' height={smallHeight}/>
}


const NewAutomateFormSkeleton = () => {
    return (

        <Grid container spacing={3} >


            <Grid item xs={6} sm={6}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3} align='left' >
                <Skeleton variant='circle' height={smallHeight} width={smallHeight}/>
            </Grid>

            <Grid item >
                <SkeletonRectSmall />
            </Grid>


            <Grid item xs={3} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={3} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item >
                <SkeletonRectSmall />
            </Grid>


            <Grid item xs={6} sm={6}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item >
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={6}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item >
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={6}>
                <SkeletonRectSmall />
            </Grid>


        </Grid>
    )
}


export default NewAutomateFormSkeleton