import React from "react";
import Grid from "@material-ui/core/Grid";
import Skeleton from '@material-ui/lab/Skeleton';


const smallHeight = 70


const SkeletonRectSmall = () => {
    return <Skeleton variant='rect' height={smallHeight}/>
}

const SkeletonRectBig = () => {
    return <Skeleton variant='rect' height={200}/>
}


const NewCampaignFormSkeleton = () => {
    return (

        <Grid container spacing={3} alignItems='center' >


            <Grid item xs={6} sm={6}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={6}>
                <SkeletonRectSmall />
            </Grid>


            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>


            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3} align='center' >
                <Skeleton variant='circle' height={smallHeight} width={smallHeight}/>
            </Grid>


            <Grid item xs={12} sm={6}>
                <SkeletonRectBig />
            </Grid>

            <Grid item xs={12} sm={6}>
                <SkeletonRectBig />
            </Grid>


            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={6} sm={3}>
                <SkeletonRectSmall />
            </Grid>


            <Grid item xs={9} sm={9} >
                <SkeletonRectSmall />
            </Grid>

            <Grid item xs={3} sm={3} >
                <SkeletonRectSmall />
            </Grid>


        </Grid>
    )
}


export default NewCampaignFormSkeleton