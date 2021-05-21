import React from "react";
import ApiService from "../../../../services/api-service";
import AudiosPageSkeleton from "../../audios-page/audios-page-skeleton";
import ListenersesTableView from "../../../tables/listenerses-table-view";


export default class ListenersesTable extends React.Component {

    state = {
        loading: true,
        listenerses: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateListenerses()
    }

    updateListenerses = () => {
        this.api.getListenerses().then(this.onListenersesLoaded)
    }

    onListenersesLoaded = (listenerses) => {
        if (typeof listenerses !== 'undefined') {
            this.setState({
                listenerses: listenerses,
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
        const {loading, hasData, listenerses} = this.state
        const table = hasData ? <ListenersesTableView rows={listenerses} /> : null
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