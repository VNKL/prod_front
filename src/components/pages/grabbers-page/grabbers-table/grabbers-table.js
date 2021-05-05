import React from "react";
import ApiService from "../../../../services/api-service";
import AudiosPageSkeleton from "../../audios-page/audios-page-skeleton";
import GrabbersTableView from "../../../tables/grabbers-table-view";


export default class GrabbersTable extends React.Component {

    state = {
        loading: true,
        grabbers: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateGrabbers()
    }

    updateGrabbers = () => {
        this.api.getGrabbers().then(this.onGrabbersLoaded)
    }

    onGrabbersLoaded = (grabbers) => {
        if (typeof grabbers !== 'undefined') {
            this.setState({
                grabbers: grabbers,
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
        const {loading, hasData, grabbers} = this.state
        const table = hasData ? <GrabbersTableView rows={grabbers} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>У тебя еще нет созданных задач</h2>

        return (
            <div className='grabbers-page'>
                {skeleton}
                {table}
                {error}
            </div>
        )
    }
}