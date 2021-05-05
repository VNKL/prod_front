import React from "react";
import Grid from "@material-ui/core/Grid";
import ApiService from "../../../services/api-service";
import AudiosPageSkeleton from "../audios-page/audios-page-skeleton";
import { Redirect } from 'react-router-dom'
import GrabberTableView from "../../tables/grabber-table-view";


export default class GrabberPage extends React.Component {

    state = {
        grabberId: null,
        name: null,
        loading: true,
        posts: null,
        hasData: false,
        hasCsv: false,
        doRedirect: false,
    }
    api = new ApiService()

    grabberId = this.props.grabberId

    componentDidMount() {
        this.loadRelated()
    }

    loadRelated = () => {
        this.api.getGrabber(this.grabberId).then(this.onGrabberLoaded)
    }

    onGrabberLoaded = (grabber) => {
        if (typeof grabber !== 'undefined') {
            this.setState({
                grabberId: grabber.id,
                name: grabber.name,
                posts: grabber.posts,
                loading: false,
                hasData: true,
                hasCsv: !!grabber.posts,
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
            this.api.downloadGrabberResultCsv(this.state.grabberId, this.state.name)
        }
    }

    handleDelete = () => {
        this.api.deleteGrabber(this.grabberId).then(() => {this.setState({doRedirect: true})})
    }

    render() {

        const {loading, hasData, posts, hasCsv } = this.state
        const table = hasData ? <GrabberTableView rows={posts}
                                                  handleDownload={this.handleDownload}
                                                  handleDelete={this.handleDelete}
                                                  hasCsv={hasCsv} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>Ошибка с получением данных</h2>

        return (
            <Grid container spacing={3} alignItems='center'>

                <Grid item xs={12}>
                    { this.state.doRedirect && <Redirect to="/grabbers" /> }
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