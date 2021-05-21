import React from "react";
import ApiService from "../../../services/api-service";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import NewListenersForm from "./new-listeners-form";
import NewListenersHelpBlock from "./new-listeners-help-block";


function BalanceAlert(props) {
    return <MuiAlert elevation={16} variant="filled" {...props} />;
}


export default class NewListenersPage extends React.Component {

    state = {
        balanceError: false,
        listenersSettings: undefined,
        listenersIsStarting: false
    }

    api = new ApiService()

    getUser = () => {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            const balanceError = user.balance - 0 < 0
            const listenersIsStarting = !balanceError
            this.setState({balanceError, listenersIsStarting: listenersIsStarting}, this.startListeners)
        }
    }

    startListeners = () => {
        if (!this.state.balanceError){
            this.api.createListeners(this.state.listenersSettings)
        }
    }

    checkBalance = (listenersSettings) => {
        this.setState({listenersSettings: listenersSettings})
        this.getUser()
    }

    handleCloseBalanceAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({balanceError: false});
    };

    handleCloseListenersIsStartingAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({listenersIsStarting: false});
    };

    render() {
        return (
            <React.Fragment>

                <Grid container spacing={6}>
                    <Grid item xs={3}>
                        <NewListenersForm startListeners={this.checkBalance} />
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs>
                        <NewListenersHelpBlock />
                    </Grid>
                </Grid>

                <Snackbar open={this.state.balanceError} autoHideDuration={6000}
                          onClose={this.handleCloseBalanceAlert}>
                    <BalanceAlert onClose={this.handleCloseBalanceAlert} severity="error">
                        Твоего баланса недостаточно для запуска нового парсера
                    </BalanceAlert>
                </Snackbar>

                <Snackbar open={this.state.listenersIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseListenersIsStartingAlert}>
                    <BalanceAlert onClose={this.handleCloseListenersIsStartingAlert} severity="success">
                        Парсер запускается, это займет некоторое время
                    </BalanceAlert>
                </Snackbar>

            </React.Fragment>
        )
    }
}