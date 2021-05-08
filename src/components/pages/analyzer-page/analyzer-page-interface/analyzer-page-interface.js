import React from "react";
import ApiService from "../../../../services/api-service";
import Spinner from "../../../spinner";
import AnalyzerPageListView from "../../../lists/analyzer-page-list-view";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AnalyzerPageHelpBlock from "../analyzer-page-help-block";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";


const analyzerSummaryComponent = (anal, artistName, photoUrl, artistUrl, handleDelete) => {
    return (
        <Grid container spacing={3} >

            <Grid item xs={12}>
                <Grid container spacing={3} alignItems='center' >
                    <Grid item >
                        <Avatar src={photoUrl} alt='cover' style={{width: 100, height: 100}} />
                    </Grid>
                    <Grid item xs>
                        <Typography align='left' variant='h4'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {window.open(artistUrl)}} > { artistName } </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <Button fullWidth variant='contained' color='secondary' onClick={handleDelete} >
                            Удалить результат
                        </Button>
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
        anal: null,
        doRedirect: false
    }
    api = new ApiService()


    componentDidMount() {
        this.api.getAnalyzer(this.props.analyzerId).then(this.onAnalyzerLoaded)
    }

    onAnalyzerLoaded = (anal) => {
        this.setState({anal: anal, loading: false})
    }

    handleDelete = () => {
        this.api.deleteAnalyzer(this.props.analyzerId).then(() => {this.setState({doRedirect: true})})
    }

    render() {

        const { loading, anal } = this.state
        const spinner = loading ? <Spinner /> : null
        const page = anal ? analyzerSummaryComponent(anal.analysis,
                                                     anal.artistName,
                                                     anal.photoUrl,
                                                     anal.artistUrl,
                                                     this.handleDelete) : null

        return (
            <div>
                { this.state.doRedirect && <Redirect to="/analyzers" /> }
                {spinner}
                {page}
            </div>
        )
    }
}
