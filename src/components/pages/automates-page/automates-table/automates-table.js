import React from 'react';
import ApiService from "../../../../services/api-service";
import AutomatesTableView from "../../../tables/automates-table-view";
import CampaignsPageSkeleton from "../../campaigns-page/campaigns-page-skeleton";


class AutomatesTable extends React.Component {

    state = {
        loading: true,
        automates: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateAutomates()
    }

    updateAutomates = () => {
        this.api.getAutomates().then(this.onAutomatesLoaded)
    }

    onAutomatesLoaded = (automates) => {
        if (typeof automates !== 'undefined') {
            this.setState({
                automates: automates,
                loading: false,
                hasData: true
            })
        } else {
            this.setState({
                loading: false,
                hasData: false
            })
        }
    }

    handleStop = (automateId) => {
        this.setState({automateIsStopping: true})
        this.api.stopAutomate(automateId).then(this.updateAutomates)
    }

    render() {
        const {loading, hasData, automates} = this.state
        const table = hasData ? <AutomatesTableView rows={automates} handleStop={this.handleStop} /> : null
        const skeleton = loading ? <CampaignsPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>У тебя еще нет автоматизаций</h2>

        return (
            <div className='automates-page'>
                {skeleton}
                {table}
                {error}
            </div>
        )
    }

}


export default AutomatesTable