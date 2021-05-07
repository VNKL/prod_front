import React from "react";
import ApiService from "../../../../services/api-service";
import Spinner from "../../../spinner";
import AnalyzerPageListView from "../../../lists/analyzer-page-list-view";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AnalyzerPageHelpBlock from "../analyzer-page-help-block";


const analyzerSummaryComponent = (anal, artistName, photoUrl, artistUrl) => {
    return (
        <Grid container spacing={3} >

            <Grid item xs={12}>
                <Grid container spacing={1} alignItems='center' >
                    <Grid item xs={1}>
                        <Avatar src={photoUrl} alt='cover' style={{width: 100, height: 100}} />
                    </Grid>
                    <Grid item xs={9}>
                        <Typography align='left' variant='h5'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {window.open(artistUrl)}} > { artistName } </Typography>
                    </Grid>
                </Grid>
            </Grid>


            <Grid item xs={8} >
                <AnalyzerPageListView anal={anal} />
            </Grid>

            <Grid item xs={4} >
                <AnalyzerPageHelpBlock />
            </Grid>

        </Grid>
    )
}



export default class AnalyzerPageInterface extends React.Component {

    state = {
        loading: true,
        anal: null
    }
    api = new ApiService()


    componentDidMount() {
        this.api.getAnalyzer(this.props.analyzerId).then(this.onAnalyzerLoaded)
    }

    onAnalyzerLoaded = (anal) => {
        this.setState({anal: anal, loading: false})
    }

    render() {

        const { loading, anal } = this.state
        const spinner = loading ? <Spinner /> : null
        const page = anal ? analyzerSummaryComponent(anal.analysis, anal.artistName, anal.photoUrl, anal.artistUrl) : null

        return (
            <div>
                {spinner}
                {page}
            </div>
        )
    }
}
