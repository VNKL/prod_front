import React from "react";
import Grid from "@material-ui/core/Grid";
import ApiService, {dateStrFromParam} from "../../../services/api-service";
import AdsTableView from "../../tables/ads-table-view";
import AdsHeader from "./ads-header";
import AdsPageSkeleton from "./ads-page-skeleton";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { Redirect } from 'react-router-dom'


function UpdateSegmentSizesAlert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default class AdsPage extends React.Component {

    state = {
        loading: true,
        ads: null,
        campaign: null,
        hasData: false,
        updateSegmentsIsStarting: false,
        doRedirect: false,
        campRename: undefined,
    }
    api = new ApiService()

    campaignId = this.props.campaignId

    componentDidMount() {
        this.loadAds()
    }

    loadAds = () => {
        this.api.getAds(this.campaignId).then(this.onAdsLoaded)
    }

    onAdsLoaded = (ads) => {
        if (typeof ads !== 'undefined') {
            this.setState({
                campaign: ads,
                ads: ads.ads,
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

    updateStats = () => {
        this.setState({loading: true, ads: null, campaign: null, hasData: false})
        this.api.updateAdsStat(this.campaignId).then(this.onAdsLoaded)
    }

    updateSegmentSizes = () => {
        this.setState({updateSegmentsIsStarting: true})
        this.api.updateSegmentSizes(this.campaignId)
    }

    openCampaignInCabinet = () => {
        const url = `https://vk.com/ads?act=office&union_id=${this.state.campaign.campaignId}`
        window.open(url)
    }

    handleDownload = () => {
        if (this.state.campaign !== null) {
            const campaignId = this.state.campaign.campaignId
            const fileName = `${this.state.campaign.name} (${dateStrFromParam(this.state.campaign.updateDate)}).csv`
            this.api.downloadCampaignStats(campaignId, fileName)
        }
    }

    handleDelete = () => {
        this.api.deleteCampaign(this.campaignId).then(() => {this.setState({doRedirect: true})})
    }

    handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({updateSegmentsIsStarting: false});
    };

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value
        this.setState({[name]: value}, () => {if(this.state.campRename) {}})
    }

    renameCampaign = () => {
        const campRename = this.state.campRename
        if (campRename !== undefined) {
            this.setState({campRename: undefined}, () => {if(this.state.campRename) {}})
            this.api.renameCampaign(this.campaignId, campRename).then(this.onAdsLoaded)
        }
    }

    render() {

        const {loading, hasData, ads, campaign} = this.state
        const header = hasData ? <AdsHeader cover={campaign.cover}
                                            name={campaign.name}
                                            updateStats={this.updateStats}
                                            updateSegmentSizes={this.updateSegmentSizes}
                                            openCampaignInCabinet={this.openCampaignInCabinet}
                                            handleChange={this.handleChange}
                                            renameCampaign={this.renameCampaign} /> : null
        const table = hasData ? <AdsTableView rows={ads} handleDownload={this.handleDownload} handleDelete={this.handleDelete}/> : null
        const skeleton = loading ? <AdsPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>Ошибка с получением данных</h2>

        return (
            <React.Fragment >

                <Grid container spacing={3} alignItems='center'>

                    <Grid item xs={12}>
                        { this.state.doRedirect && <Redirect to="/campaigns" /> }
                        {header}
                        {skeleton}
                    </Grid>

                    <Grid item xs={12}>
                        {table}
                        {error}
                    </Grid>

                </Grid>

                <Snackbar open={this.state.updateSegmentsIsStarting} autoHideDuration={6000}
                          onClose={this.handleCloseCampaignIsStartingAlert}>
                    <UpdateSegmentSizesAlert onClose={this.handleCloseAlert} severity="success">
                        Размеры аудиторий обновляются, это займет некоторое время
                    </UpdateSegmentSizesAlert>
                </Snackbar>

            </React.Fragment>



        )
    }
}