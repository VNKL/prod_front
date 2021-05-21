import React from "react";
import Grid from "@material-ui/core/Grid";
import ApiService from "../../../services/api-service";
import AudiosPageSkeleton from "../audios-page/audios-page-skeleton";
import { Redirect } from 'react-router-dom'
import ListenersTableView from "../../tables/listeners-table-view";


export default class ListenersPage extends React.Component {

    state = {
        listenersId: null,
        name: null,
        loading: true,
        items: null,
        hasData: false,
        hasCsv: false,
        doRedirect: false,
    }
    api = new ApiService()

    listenersId = this.props.listenersId

    componentDidMount() {
        this.loadListeners()
    }

    loadListeners = () => {
        this.api.getListeners(this.listenersId).then(this.onListenersLoaded)
    }

    onListenersLoaded = (listeners) => {
        if (typeof listeners !== 'undefined') {
            this.setState({
                listenersId: listeners.id,
                name: listeners.name,
                items: listeners.items,
                loading: false,
                hasData: true,
                hasCsv: !!listeners.items,
            })
        } else {
            this.setState({
                loading: false,
                hasData: false
            })
        }
    }

    handleDownload = () => {
        if (this.state.hasCsv) {
            this.api.downloadListenersResultCsv(this.state.listenersId, this.state.name)
        }
    }

    handleDelete = () => {
        this.api.deleteListeners(this.listenersId).then(() => {this.setState({doRedirect: true})})
    }

    render() {

        const {loading, hasData, items, hasCsv } = this.state
        const table = hasData ? <ListenersTableView rows={items}
                                                    handleDownload={this.handleDownload}
                                                    handleDelete={this.handleDelete}
                                                    hasCsv={hasCsv} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>Ошибка с получением данных</h2>

        return (
            <Grid container spacing={3} alignItems='center'>

                <Grid item xs={12}>
                    { this.state.doRedirect && <Redirect to="/listeners" /> }
                    {skeleton}
                </Grid>

                <Grid item xs={12}>
                    {table}
                    {error}
                </Grid>

            </Grid>

        )
    }
}