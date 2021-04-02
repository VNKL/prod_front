import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";

import MainPage from "./main-page";
import AutomatesPage from "./automates-page";
import NewAutomatePage from "./new-automate-page";
import CampaignsPage from "./campaigns-page";
import NewCampaignPage from "./new-campaign-page";
import ParsersPage from "./parsers-page";
import NewParserPage from "./new-parser-page";
import GrabbersPage from "./grabbers-page";
import NewGrabberPage from "./new-grabber-page";
import GrabberPage from "./grabber-page";
import ChartsPage from "./charts-page";
import ArtistsPage from "./artists-page";
import ArtistPage from "./artist-page";
import AdsPage from "./ads-page";
import AudiosPage from "./audios-page";



const Pages = () => {

    return (
        <Switch>

            <Route path='/campaigns' component={CampaignsPage} />
            <Route path='/new_campaign' component={NewCampaignPage} />

            <Route path='/ads/:id?' render={({match}) => {
                const {id} = match.params
                return <AdsPage campaignId={id} />
            }}/>

            <Route path='/automates' component={AutomatesPage} />
            <Route path='/new_automate' component={NewAutomatePage} />

            <Route path='/parsers' component={ParsersPage} />
            <Route path='/new_parser' component={NewParserPage} />
            <Route path='/parser/:id?' render={({match}) => {
                const {id} = match.params
                return <AudiosPage parserId={id} />
            }}/>

            <Route path='/grabbers' component={GrabbersPage} />
            <Route path='/new_grabber' component={NewGrabberPage} />
            <Route path='/grabber/:id?' render={({match}) => {
                const {id} = match.params
                return <GrabberPage grabberId={id} />
            }}/>

            <Route path='/artists' component={ArtistsPage} />
            <Route path='/artist/:id?' render={({match}) => {
                const {id} = match.params
                return <ArtistPage artistId={id} />
            }}/>

            <Route path='/charts' component={ChartsPage} />

            <Route path='/' component={MainPage} />

            <Redirect to='/' />

        </Switch>
    )
}


export default Pages