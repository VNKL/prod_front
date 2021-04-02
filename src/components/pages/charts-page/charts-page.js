import React from "react";
import ApiService from "../../../services/api-service";
import NoPermissionsBackdrop from "../../no-permissions-backdrop";
import Spinner from "../../spinner";


const UserCanChartsPage = () => {

    return (
        <h1>Charts Page</h1>
    )
}


export default class ChartsPage extends React.Component {

    state = {
        canCharts: undefined,
        loading: true,
    }
    api = new ApiService()
    noPermissionsText = 'У тебя нет прав на работу с чартами'

    componentDidMount() {
        this.api.getUser().then(this.onUserLoaded)
    }

    onUserLoaded = (user) => {
        this.setState({canCharts: user.canCharts, loading: false})
    }

    render() {
        const {loading, canCharts} = this.state
        const page = canCharts ? UserCanChartsPage() : <NoPermissionsBackdrop text={this.noPermissionsText}/>
        const spinner = loading ? <Spinner/> : null
        return (
            <div>
                {spinner}
                {page}
            </div>
        )
    }
}
