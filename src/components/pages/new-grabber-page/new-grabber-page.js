import React from "react";
import ApiService from "../../../services/api-service";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import NewGrabberHelpBlock from "./new-grabber-help-block";
import NewGrabberForm from "./new-grabber-form";


function BalanceAlert(props) {
    return <MuiAlert elevation={16} variant="filled" {...props} />;
}


export default class NewRelatedPage extends React.Component {

    state = {
        balanceError: false,
        grabberSettings: undefined,
        grabberIsStarting: false
    }

    api = new ApiService()

    getUser = () => {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            const balanceError = user.balance - 0 < 0
            const grabberIsStarting = !balanceError
            this.setState({balanceError, grabberIsStarting: grabberIsStarting}, this.startGrabber)
        }
    }

    startGrabber = () => {
        if (!this.state.balanceError){
            this.api.createGrabber(this.state.grabberSettings)
        }
    }

    checkBalance = (grabberSettings) => {
        this.setState({grabberSettings: grabberSettings})
        this.getUser()
    }

    handleCloseBalanceAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({balanceError: false});
    };

    handleCloseGrabberIsStartingAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({grabberIsStarting: false});
    };

    render() {
        return (
            <React.Fragment>

                <Grid container spacing={6}>
                    <Grid item xs={3}>
                        <NewGrabberForm startGrabber={this.checkBalance} />
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs>
                        <NewGrabberHelpBlock />
                    </Grid>
                </Grid>

                <Snackbar open={this.state.balanceError} autoHideDuration={6000}
                          onClose={this.handleCloseBalanceAlert}>
                    <BalanceAlert onClose={this.handleCloseBalanceAlert} severity="error">
                        Твоего баланса недостаточно для запуска нового парсера
                    </BalanceAlert>
                </Snackbar>

                <Snackbar open={this.state.grabberIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseGrabberIsStartingAlert}>
                    <BalanceAlert onClose={this.handleCloseGrabberIsStartingAlert} severity="success">
                        Парсер запускается, это займет некоторое время
                    </BalanceAlert>
                </Snackbar>

            </React.Fragment>
        )
    }
}