import React from "react";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ApiService from "../../../services/api-service";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";
import Spinner from "../../spinner";
import GrabbersTable from "./grabbers-table";


const UserCanGrabbersPage = () => {
    return (
        <Grid container spacing={3}>

            <Grid item xs={6}>
                <Link component={RouterLink} to='/new_grabber' underline='none'>
                    <Button variant='contained'
                            color='secondary'
                    >
                        Запустить новый поиск
                    </Button>
                </Link>
            </Grid>

            <Grid item xs={12}>
                <GrabbersTable />
            </Grid>

        </Grid>
    )
}


export default class RelatedsPage extends React.Component {

    state = {
        canGrabbers: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование поиска скрытых постов'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canGrabbers: user.canGrabbers, loading: false})
    }

    render() {
        const {loading, canGrabbers} = this.state
        const page = canGrabbers && !loading ? UserCanGrabbersPage() : null
        const permError = !loading && !canGrabbers ? <NoPermissionsBackdrop text={this.noPermissionsText} /> : null
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