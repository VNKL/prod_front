import React from "react";
import Grid from "@material-ui/core/Grid";
import ApiService from "../../../services/api-service";
import AudiosPageSkeleton from "../audios-page/audios-page-skeleton";
import { Redirect } from 'react-router-dom'
import RelatedTableView from "../../tables/related-table-view";


export default class RelatedPage extends React.Component {

    state = {
        relatedId: null,
        name: null,
        loading: true,
        artists: null,
        hasData: false,
        hasCsv: false,
        doRedirect: false,
    }
    api = new ApiService()

    relatedId = this.props.relatedId

    componentDidMount() {
        this.loadRelated()
    }

    loadRelated = () => {
        this.api.getRelated(this.relatedId).then(this.onRelatedLoaded)
    }

    onRelatedLoaded = (related) => {
        if (typeof related !== 'undefined') {
            this.setState({
                relatedId: related.id,
                name: related.name,
                artists: related.artists,
                loading: false,
                hasData: true,
                hasCsv: !!related.artists,
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
            this.api.downloadRelatedResultCsv(this.state.relatedId, this.state.name)
        }
    }

    handleDelete = () => {
        this.api.deleteRelated(this.relatedId).then(() => {this.setState({doRedirect: true})})
    }

    render() {

        const {loading, hasData, artists, hasCsv } = this.state
        const table = hasData ? <RelatedTableView rows={artists}
                                                  handleDownload={this.handleDownload}
                                                  handleDelete={this.handleDelete}
                                                  hasCsv={hasCsv} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>Ошибка с получением данных</h2>

        return (
            <Grid container spacing={3} alignItems='center'>

                <Grid item xs={12}>
                    { this.state.doRedirect && <Redirect to="/relateds" /> }
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