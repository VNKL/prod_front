import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import CampaignsTable from "./campaigns-table";
import ApiService from "../../../services/api-service";
import Spinner from "../../spinner";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";


const UserCanAdsPage = () => {

    return (
        <Grid container spacing={3}>

            <Grid item xs={6}>
                <Link component={RouterLink} to='/new_campaign' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Запустить новую кампанию
                    </Button>
                </Link>
            </Grid>

            <Grid item xs={6} align='right'>
                <Link component={RouterLink} to='/new_automate' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Автоматизировать кампанию
                    </Button>
                </Link>
            </Grid>



            <Grid item xs={12}>
                <CampaignsTable />
            </Grid>

        </Grid>

    )
}


export default class CampaignsPage extends React.Component {
    state = {
        canAds: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование модулей таргета'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canAds: user.canAds, loading: false})
    }

    render() {
        const {loading, canAds} = this.state
        const page = canAds ? UserCanAdsPage() : <NoPermissionsBackdrop text={this.noPermissionsText} />
        const spinner = loading ? <Spinner /> : null
        return (
            <div>
                {spinner}
                {page}
            </div>
        )
    }
}