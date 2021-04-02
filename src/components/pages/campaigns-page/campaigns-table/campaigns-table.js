import React from 'react';
import ApiService from "../../../../services/api-service";
import CampaignsTableView from "../../../tables/campaigns-table-view";
import CampaignsPageSkeleton from "../campaigns-page-skeleton";


class CampaignsTable extends React.Component {

    state = {
        loading: true,
        campaigns: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateCampaigns()
    }

    updateCampaigns = () => {
        this.api.getCampaigns().then(this.onDataLoaded)
    }

    onDataLoaded = (campaigns) => {
        if (typeof campaigns !== 'undefined') {
            this.setState({
                campaigns,
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

    render() {
        const {loading, hasData, campaigns} = this.state
        const table = hasData ? <CampaignsTableView rows={campaigns} /> : null
        const spinner = loading ? <CampaignsPageSkeleton /> : null
        const error = hasData ? null : spinner ? null : <h2>У тебя еще нет созданных кампаний</h2>

        return (
            <div className='campaigns-page'>
                {spinner}
                {table}
                {error}
            </div>
        )
    }

}


export default CampaignsTable