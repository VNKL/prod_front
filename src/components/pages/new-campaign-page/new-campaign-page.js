import React from "react";
import NewCampaignForm from "./new-campaign-form";
import Grid from "@material-ui/core/Grid";
import NewCampaignFormSkeleton from "./new-campaign-form-skeleton";
import ApiService from "../../../services/api-service";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NewCampaignHelpBlock from "./new-campaign-help-block";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";


function BalanceAlert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default class NewCampaignPage extends React.Component {
    api = new ApiService()
    state = {
        loading: true,
        hasToken: false,
        cabinets: null,
        hasCabinets: false,
        hasGroups: false,
        balanceError: false,
        campaignSettings: undefined,
        campaignIsStarting: false
    }

    componentDidMount() {
        this.checkToken()
    }

    getCabsAndGroups = () => {
        if (this.state.hasToken) {
            this.api.getCabsAndGroups().then(this.onCabsAndGroupLoaded)
        }
    }

    onCabsAndGroupLoaded = (cabsAndGroups) => {
        if (typeof cabsAndGroups !== 'undefined') {
            this.setState({
                cabinets: cabsAndGroups.cabinets,
                groups: cabsAndGroups.groups,
                hasCabinets: true,
                hasGroups: true
            })
        }
    }

    checkToken = () => {
        this.api.getUser().then(this.onTokenLoaded)
    }

    onTokenLoaded = (user) => {
        this.setState({loading: false})
        if (typeof user !== 'undefined') {
            this.setState({hasToken: user.hasToken}, () => {this.getCabsAndGroups()})
        }
    }

    getUser = () => {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            const balanceError = user.balance - 0 < 0
            const campaignIsStarting = !balanceError
            this.setState({balanceError, campaignIsStarting}, this.createCampaign)
        }
    }

    createCampaign = () => {
        if (!this.state.balanceError){
            this.api.createCampaign(this.state.campaignSettings)
        } else {
            console.log('low balance')
        }

    }

    startCampaign = (campaignSettings) => {
        this.setState({campaignSettings: campaignSettings})
        this.getUser()
    }

    handleCloseBalanceAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({balanceError: false});
    };

    handleCloseCampaignIsStartingAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({campaignIsStarting: false});
    };


    render() {
        const {hasCabinets, hasGroups, hasToken, cabinets, groups, loading} = this.state

        const form = hasCabinets && hasGroups ? <NewCampaignForm cabinets={cabinets}
                                                                 groups={groups}
                                                                 startCampaign={this.startCampaign} /> : null
        const spinner = hasCabinets && hasGroups ? null : <NewCampaignFormSkeleton />
        const tokenError = !hasToken && !loading ? <NoPermissionsBackdrop text="Ты еще не привязал свой ВК-аккаунт" /> : null


        return (
            <React.Fragment>

                <Grid container spacing={6}>
                    <Grid item xs>
                        {form}
                        {spinner}
                        {tokenError}
                    </Grid>
                    <Grid item xs>
                        <NewCampaignHelpBlock />
                    </Grid>
                </Grid>

                <Snackbar open={this.state.balanceError} autoHideDuration={6000}
                          onClose={this.handleCloseBalanceAlert}>
                    <BalanceAlert onClose={this.handleCloseBalanceAlert} severity="error">
                        Твоего баланса недостаточно для запуска новой кампании
                    </BalanceAlert>
                </Snackbar>

                <Snackbar open={this.state.campaignIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseCampaignIsStartingAlert}>
                    <BalanceAlert onClose={this.handleCloseCampaignIsStartingAlert} severity="success">
                        Кампания запускается, это займет некоторое время
                    </BalanceAlert>
                </Snackbar>

            </React.Fragment>
        )
    }
}