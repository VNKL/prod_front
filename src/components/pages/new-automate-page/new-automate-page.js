import React from "react";
import NewAutomateForm from "./new-automate-form";
import Grid from "@material-ui/core/Grid";
import NewAutomateHelpBlock from "./new-automate-help-block";
import ApiService from "../../../services/api-service";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import NewAutomateFormSkeleton from "./new-automate-form-skeleton";


function BalanceAlert(props) {
    return <MuiAlert elevation={16} variant="filled" {...props} />;
}


class NewAutomatePage extends React.Component {

    state = {
        loading: true,
        campaigns: null,
        hasData: false,
        balanceError: false,
        automateIsStarting: false,
        automateSettings: undefined
    }

    api = new ApiService()

    componentDidMount() {
        this.getCampaigns()
    }

    getCampaigns = () => {
        this.api.getCampaigns().then(this.onCampaignsLoaded)
    }

    getUser = () => {
        this.api.getUser().then(this.onUserLoaded)
    }

    onCampaignsLoaded = (campaigns) => {
        if (typeof campaigns !== 'undefined') {
            this.setState({
                campaigns: campaigns.filter(campaign => campaign.status !== 2),
                loading: false,
                hasData: true,
            })
        }
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            const balanceError = user.balance - 0 < 0
            const automateIsStarting = !balanceError
            this.setState({balanceError, automateIsStarting}, this.automateCampaign)
        }
    }

    automateCampaign = () => {
        if (!this.state.balanceError){
            this.api.createAutomate(this.state.automateSettings)
        }
    }

    startAutomate = (automateSettings) => {
        this.setState({automateSettings: automateSettings})
        this.getUser()
    }

    handleCloseBalanceAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({balanceError: false});
    };

    handleCloseAutomateIsStartingAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({automateIsStarting: false});
    };

    render() {

        const {loading, hasData, campaigns} = this.state

        const form = hasData ? <NewAutomateForm campaigns={campaigns} startAutomate={this.startAutomate}/> : null
        const spinner = loading ? <NewAutomateFormSkeleton /> : null
        const error = hasData ? null : spinner ? null : <h2>У тебя еще нет созданных кампаний</h2>

        return (
            <React.Fragment>

                <Grid container spacing={6}>
                    <Grid item xs>
                        { spinner }
                        { form }
                        { error }
                    </Grid>
                    <Grid item xs>
                        <NewAutomateHelpBlock />
                    </Grid>
                </Grid>

                <Snackbar open={this.state.balanceError} autoHideDuration={6000}
                          onClose={this.handleCloseBalanceAlert}>
                    <BalanceAlert onClose={this.handleCloseBalanceAlert} severity="error">
                        Твоего баланса недостаточно для запуска новой автоматизации
                    </BalanceAlert>
                </Snackbar>

                <Snackbar open={this.state.automateIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseAutomateIsStartingAlert}>
                    <BalanceAlert onClose={this.handleCloseAutomateIsStartingAlert} severity="success">
                        Автоматизация запускается, это займет некоторое время
                    </BalanceAlert>
                </Snackbar>

            </React.Fragment>
        )
    }

}


export default NewAutomatePage