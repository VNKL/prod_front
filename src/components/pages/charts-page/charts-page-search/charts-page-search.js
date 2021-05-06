import Grid from "@material-ui/core/Grid";
import ChartsPageForm from "../charts-page-form";
import ChartsSearchTableView from "../../../tables/charts-search-table-view";
import React from "react";
import AudiosPageSkeleton from "../../audios-page/audios-page-skeleton";
import ApiService from "../../../../services/api-service";
import ChartsPageHelpBlock from "../charts-page-help-block";


const ChartsPageSearch = () => {

    const [state, setState] = React.useState({
        loading: false,
        releases: []
    })

    const api = new ApiService()

    const startSearch = (settings) => {
        setState({...state, needTable: true, loading: true})
        loadSearchResult(settings)
    }

    const loadSearchResult = (settings) => {
        api.chartsSearch(settings).then(onSearchResultLoaded)
    }

    const onSearchResultLoaded = (result) => {
        setState({...state, needTable: true, loading: false,  releases: result})
    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={8} >
                <Grid container spacing={3} >
                    <Grid item xs={12} >
                        <ChartsPageForm startSearch={startSearch} />
                    </Grid>
                    <Grid item xs={12}>
                        {
                            state.loading ?<AudiosPageSkeleton /> : <ChartsSearchTableView rows={state.releases} />
                        }
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={4} >
                <ChartsPageHelpBlock />
            </Grid>


        </Grid>
    )
}

export default ChartsPageSearch