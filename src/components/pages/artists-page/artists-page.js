import React from "react";
import ApiService from "../../../services/api-service";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";
import Spinner from "../../spinner";


const UserCanArtistsPage = () => {

    return (
        <h1>Artists Page</h1>
    )
}


export default class ChartsPage extends React.Component {

    state = {
        canAnalyzers: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на использование анализаторов артистов'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canAnalyzers: user.canAnalyzers, loading: false})
    }

    render() {
        const {loading, canAnalyzers} = this.state
        const page = canAnalyzers ? UserCanArtistsPage() : <NoPermissionsBackdrop text={this.noPermissionsText}/>
        const spinner = loading ? <Spinner/> : null
        return (
            <div>
                {spinner}
                {page}
            </div>
        )
    }
}
