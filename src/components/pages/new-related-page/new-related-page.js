import React from "react";
import ApiService from "../../../services/api-service";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import NewRelatedForm from "./new-related-form";
import NewRelatedHelpBlock from "./new-related-help-block";


function BalanceAlert(props) {
    return <MuiAlert elevation={16} variant="filled" {...props} />;
}


export default class NewRelatedPage extends React.Component {

    state = {
        balanceError: false,
        relatedSettings: undefined,
        relatedIsStarting: false
    }

    api = new ApiService()

    getUser = () => {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            const balanceError = user.balance - 0 < 0
            const relatedIsStarting = !balanceError
            this.setState({balanceError, relatedIsStarting}, this.startRelated)
        }
    }

    startRelated = () => {
        if (!this.state.balanceError){
            this.api.createRelated(this.state.relatedSettings)
        }
    }

    checkBalance = (relatedSettings) => {
        this.setState({relatedSettings: relatedSettings})
        this.getUser()
    }

    handleCloseBalanceAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({balanceError: false});
    };

    handleCloseRelatedIsStartingAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({relatedIsStarting: false});
    };

    render() {
        return (
            <React.Fragment>

                <Grid container spacing={6}>
                    <Grid item xs={3}>
                        <NewRelatedForm startRelated={this.checkBalance} />
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs>
                        <NewRelatedHelpBlock />
                    </Grid>
                </Grid>

                <Snackbar open={this.state.balanceError} autoHideDuration={6000}
                          onClose={this.handleCloseBalanceAlert}>
                    <BalanceAlert onClose={this.handleCloseBalanceAlert} severity="error">
                        Твоего баланса недостаточно для запуска нового парсера
                    </BalanceAlert>
                </Snackbar>

                <Snackbar open={this.state.relatedIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseRelatedIsStartingAlert}>
                    <BalanceAlert onClose={this.handleCloseRelatedIsStartingAlert} severity="success">
                        Парсер запускается, это займет некоторое время
                    </BalanceAlert>
                </Snackbar>

            </React.Fragment>
        )
    }
}