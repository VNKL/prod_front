import React from "react";
import ApiService from "../../../../services/api-service";
import AudiosPageSkeleton from "../../audios-page/audios-page-skeleton";
import RelatedsTableView from "../../../tables/relateds-table-view";


export default class RelatedsTable extends React.Component {

    state = {
        loading: true,
        relateds: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateRelateds()
    }

    updateRelateds = () => {
        this.api.getRelateds().then(this.onRelatedsLoaded)
    }

    onRelatedsLoaded = (relateds) => {
        if (typeof relateds !== 'undefined') {
            this.setState({
                relateds: relateds,
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
        const {loading, hasData, relateds} = this.state
        const table = hasData ? <RelatedsTableView rows={relateds} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>У тебя еще нет созданных задач</h2>

        return (
            <div className='campaigns-page'>
                {skeleton}
                {table}
                {error}
            </div>
        )
    }
}