import React from "react";
import ApiService from "../../../../services/api-service";
import {Grid} from "@material-ui/core";
import AnalyzersPageForm from "../analyzers-page-form";
import AnalyzersTableView from "../../../tables/analyzers-table-view";


export default class AnalyzersPageInterface extends React.Component {

    state = {
        analyzers: null,
        loading: true,
        artistUrl: '',
        artistUrlError: false
    }
    api = new ApiService()

    componentDidMount() {
        this.api.getAnalyzers().then(this.onAnalyzersLoaded)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.artistUrl !== prevState.artistUrl) {
            this.api.getAnalyzers().then(this.onAnalyzersLoaded)
        }
    }

    onAnalyzersLoaded = (anals) => {
        this.setState({analyzers: anals, loading: false})
    }

    startAnal = (params) => {
        this.api.createAnalyzer(params.artistUrl)
        this.setState({artistUrl: params.artistUrl, loading: true}, () => {
            if (this.state.artistUrl === '') {
                this.setState({artistUrlError: true})
            }
        })
    }


    render() {
        const { analyzers, loading } = this.state

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} >
                    <AnalyzersPageForm startAnal={this.startAnal}/>
                </Grid>

                <Grid item xs={12} >
                    {!loading ? <AnalyzersTableView rows={analyzers}/> : null}
                </Grid>

            </Grid>
        )
    }
}
