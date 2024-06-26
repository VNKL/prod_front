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
import RelatedsPage from "./relateds-page";
import AdsPage from "./ads-page";
import AudiosPage from "./audios-page";
import RelatedPage from "./related-page";
import NewRelatedPage from "./new-related-page";
import AnalyzersPage from "./analyzers-page";
import AnalyzerPage from "./analyzer-page";
import ListenersesPage from "./listenerses-page";
import NewListenersPage from "./new-listeners-page/new-listeners-page";
import ListenersPage from "./listeners-page";


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

            <Route path='/relateds' component={RelatedsPage} />
            <Route path='/new_related' component={NewRelatedPage} />
            <Route path='/related/:id?' render={({match}) => {
                const {id} = match.params
                return <RelatedPage relatedId={id} />
            }}/>

            <Route path='/grabbers' component={GrabbersPage} />
            <Route path='/new_grabber' component={NewGrabberPage} />
            <Route path='/grabber/:id?' render={({match}) => {
                const {id} = match.params
                return <GrabberPage grabberId={id} />
            }}/>

            <Route path='/charts' component={ChartsPage} />

            <Route path='/analyzers' component={AnalyzersPage} />
            <Route path='/analyzer/:id?' render={({match}) => {
                const {id} = match.params
                return <AnalyzerPage analyzerId={id} />
            }}/>

            <Route path='/listeners' component={ListenersesPage} />
            <Route path='/new_listeners' component={NewListenersPage} />
            <Route path='/listeners_result/:id?' render={({match}) => {
                const {id} = match.params
                return <ListenersPage listenersId={id} />
            }}/>


            <Route path='/' component={MainPage} />

            <Redirect to='/' />

        </Switch>
    )
}


export default Pages