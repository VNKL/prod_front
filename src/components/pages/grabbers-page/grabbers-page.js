import React from "react";
import ApiService from "../../../services/api-service";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";
import Spinner from "../../spinner";


const UserCanGrabbersPage = () => {
    return (
        <h1>Grabbers Page</h1>
    )
}


export default class GrabbersPage extends React.Component {

    state = {
        canGrabbers: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование парсеров промо-постов'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canGrabbers: user.canGrabbers, loading: false})
    }

    render() {
        const {loading, canGrabbers} = this.state
        const page = canGrabbers ? UserCanGrabbersPage() : <NoPermissionsBackdrop text={this.noPermissionsText} />
        const spinner = loading ? <Spinner /> : null
        return (
            <div>
                {spinner}
                {page}
            </div>
        )
    }
}