import React from "react";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ApiService from "../../../services/api-service";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";
import Spinner from "../../spinner";
import RelatedsTable from "./relateds-table";


const UserCanRelatedPage = () => {
    return (
        <Grid container spacing={3}>

            <Grid item xs={6}>
                <Link component={RouterLink} to='/new_related' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Запустить новый поиск
                    </Button>
                </Link>
            </Grid>

            <Grid item xs={12}>
                <RelatedsTable />
            </Grid>

        </Grid>
    )
}


export default class RelatedsPage extends React.Component {

    state = {
        canRelated: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование поиска похожих артистов'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canRelated: user.canRelated, loading: false})
    }

    render() {
        const {loading, canRelated} = this.state
        const page = canRelated && !loading ? UserCanRelatedPage() : null
        const permError = !loading && !canRelated ? <NoPermissionsBackdrop text={this.noPermissionsText} /> : null
        const spinner = loading ? <Spinner /> : null
        return (
            <div>
                {spinner}
                {page}
                {permError}
            </div>
        )
    }
}