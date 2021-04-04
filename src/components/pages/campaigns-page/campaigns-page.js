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
        canAds: false,
        loading: true,
        hasToken: false
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование модулей таргета'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            this.setState({hasToken: user.hasToken, loading: false}, () => {
                if (this.state.hasToken) {
                    this.setState({canAds: user.canAds})
                }
            })
        }
    }

    render() {
        const {loading, canAds, hasToken} = this.state
        const tokenError = !hasToken && !loading ? <NoPermissionsBackdrop text="Ты еще не привязал свой ВК-аккаунт" /> : null
        const page = canAds ? UserCanAdsPage() : tokenError ? null : <NoPermissionsBackdrop text={this.noPermissionsText} />
        const spinner = loading ? <Spinner /> : null


        return (
            <div>
                {spinner}
                {page}
                {tokenError}
            </div>
        )
    }
}