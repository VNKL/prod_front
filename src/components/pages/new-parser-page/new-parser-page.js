import React from "react";
import NewParserForm from "./new-parser-form";
import ApiService from "../../../services/api-service";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import NewParserHelpBlock from "./new-parser-help-block";


function BalanceAlert(props) {
    return <MuiAlert elevation={16} variant="filled" {...props} />;
}


export default class NewParserPage extends React.Component {

    state = {
        balanceError: false,
        parserSettings: undefined,
        parserIsStarting: false
    }

    api = new ApiService()

    getUser = () => {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        if (typeof user !== 'undefined') {
            const balanceError = user.balance - 0 < 0
            const parserIsStarting = !balanceError
            this.setState({balanceError, parserIsStarting}, this.startParser)
        }
    }

    startParser = () => {
        if (!this.state.balanceError){
            this.api.createParser(this.state.parserSettings)
        }
    }

    checkBalance = (parserSettings) => {
        this.setState({parserSettings: parserSettings})
        this.getUser()
    }

    handleCloseBalanceAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({balanceError: false});
    };

    handleCloseParserIsStartingAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({parserIsStarting: false});
    };

    render() {
        return (
            <React.Fragment>

                <Grid container spacing={6}>
                    <Grid item xs>
                        <NewParserForm startParser={this.checkBalance} />
                    </Grid>
                    <Grid item xs>
                        <NewParserHelpBlock />
                    </Grid>
                </Grid>

                <Snackbar open={this.state.balanceError} autoHideDuration={6000}
                          onClose={this.handleCloseBalanceAlert}>
                    <BalanceAlert onClose={this.handleCloseBalanceAlert} severity="error">
                        Твоего баланса недостаточно для запуска нового парсера
                    </BalanceAlert>
                </Snackbar>

                <Snackbar open={this.state.parserIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseParserIsStartingAlert}>
                    <BalanceAlert onClose={this.handleCloseParserIsStartingAlert} severity="success">
                        Парсер запускается, это займет некоторое время
                    </BalanceAlert>
                </Snackbar>

            </React.Fragment>
        )
    }
}