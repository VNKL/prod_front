import React from "react";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ParsersTable from "./parsers-table";
import ApiService from "../../../services/api-service";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";
import Spinner from "../../spinner";


const UserCanParserPage = () => {
    return (
        <Grid container spacing={3}>

            <Grid item xs={6}>
                <Link component={RouterLink} to='/new_parser' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Запустить новый парсинг
                    </Button>
                </Link>
            </Grid>

            <Grid item xs={12}>
                <ParsersTable />
            </Grid>

        </Grid>
    )
}


export default class ParsersPage extends React.Component {

    state = {
        canParsers: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование парсеров по добавлениям аудио'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canParsers: user.canParsers, loading: false})
    }

    render() {
        const {loading, canParsers} = this.state
        const page = canParsers ? UserCanParserPage() : <NoPermissionsBackdrop text={this.noPermissionsText} />
        const spinner = loading ? <Spinner /> : null
        return (
            <div>
                {spinner}
                {page}
            </div>
        )
    }
}