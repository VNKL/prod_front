import * as streamSaver from "streamsaver";


function _type_str_from_type_int(typeInt) {
    if (typeInt === 0) {
        return 'Прослушивания'
    } else {
        return 'Добавления'
    }
}

function _startValue_str_from_int(strValueInt) {
    if (strValueInt === 0) {
        return 'Сразу'
    } else {
        return 'На следующий день'
    }
}

function _stopValue_str_from_int(strValueInt) {
    if (strValueInt === 0) {
        return 'В день запуска'
    } else {
        return 'Вручную'
    }
}

function _realValue_from_automate(automate) {
    if (automate.type === 0) {
        return automate.campaign.cpl
    } else {
        return automate.campaign.cps
    }
}

function _count_from_automate(automate) {
    if (automate.type === 0) {
        return automate.campaign.listens
    } else {
        return automate.campaign.saves
    }
}

function _VTR_from_automate(automate) {
    if (automate.type === 0) {
        return automate.campaign.lr
    } else {
        return automate.campaign.sr
    }
}

function _parsing_method_name_to_russian(method) {
    if (method === 'get_by_artist_url') {
        return 'Исполнитель'
    } else if (method === 'get_by_track_name') {
        return 'Трек'
    } else if (method === 'get_by_group') {
        return 'Аудиозаписи сообщества'
    } else if (method === 'get_by_playlist') {
        return 'Аудиозаписи плейлиста'
    } else if (method === 'get_by_post') {
        return 'Аудиозаписи поста'
    } else if (method === 'get_by_newsfeed') {
        return 'Поиск по новостям'
    } else if (method === 'get_by_chart') {
        return ('Чарт ВК')
    } else if (method === 'get_by_new_releases') {
        return 'Новинки ВК'
    } else {
        return 'Неизвестный метод'
    }
}

function _parsing_method_param_true_to_line(param) {
    if (param === 'True') {
        return '—'
    } else {
        return param
    }
}

function _may_audio_be_core(owner_id, audio_id) {
    const ownerStr = owner_id.toString()
    const audioStr = audio_id.toString()
    if (ownerStr.indexOf('4744') !== -1) {
        return 1
    } else if (ownerStr.indexOf('3717') !== -1) {
        return 1
    // } else if (ownerStr.indexOf('-147845620') !== -1) {
    //     return 1
    } else if (ownerStr.indexOf('-200') !== -1 && audioStr.slice(0, 4).toString() !== '4562') {
        return 1
    } else {
        return 0
    }
}

function _post_url_for_audio(post_owner, post_id) {
    if (post_owner !== null && post_id !== null) {
        return `https://vk.com/wall${post_owner}_${post_id}`
    }
}

function _need_parser_param(method) {
    if (method !== 'chart' && method !== 'new_releases') {
        return true
    }
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function _get_listens_from_post(post) {
    let listensSum = 0
    post.playlists.forEach((item) => {
        listensSum = listensSum + item.listens
    })
    return listensSum
}

function _get_saves_from_post(post) {
    let savesSum = 0
    post.playlists.forEach((item) => {
        savesSum = savesSum + item.followers
    })
    post.audios.forEach((item) => {
        savesSum = savesSum + item.savers_count
    })
    return savesSum
}

function _get_doubles_from_post(post) {
    let doublesSum = 0
    post.audios.forEach((item) => {
        doublesSum = doublesSum + item.doubles
    })
    return doublesSum
}

export function dateStrFromParam(param) {
    if (param) {
        return new Date(param).toLocaleString()
    } else {
        return '—'
    }
}

export function spacedNumber(x) {
    if (typeof x === 'number') {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}


export default class ApiService {
    _apiBaseUrl = 'http://77.223.106.194:70/api/'
    // _apiBaseUrl = 'http://127.0.0.1:8000/api/'
    _vkTokenUrl = `https://oauth.vk.com/authorize?client_id=7669131&display=page&redirect_uri=${this._apiBaseUrl}users.bindVk&scope=360448&response_type=code&v=5.126`

    async _getResponse(method, params) {
        const fullUrl = new URL(`${this._apiBaseUrl}${method}`)
        fullUrl.search = new URLSearchParams(params).toString()
        const response = await fetch(fullUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {Authorization: `JWT ${localStorage.getItem('token')}`},
        })
        if (response.ok) {
            return await response.json()
        }
    }

    async _getDownloadResponse(method, params, fileName) {

        const url = new URL(`${this._apiBaseUrl}${method}`)
        url.search = new URLSearchParams(params).toString()

        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {Authorization: `JWT ${localStorage.getItem('token')}`}})
            .then(response => response.blob())
            .then(blob => {
                try {
                    const fileStream = streamSaver.createWriteStream(fileName, {size: blob.size});
                    const readableStream = blob.stream();

                    if (window.WritableStream && readableStream.pipeTo) {
                        return readableStream
                            .pipeTo(fileStream)
                    }
                    const writer = fileStream.getWriter();
                    const reader = readableStream.getReader();

                    window.onunload = () => writer.abort()

                    const pump = () =>
                        reader
                            .read()
                            .then(res =>
                                res.done ? writer.close() : writer.write(res.value).then(pump)
                            );
                    pump();
                } catch (e) {
                    console.error(e);
                }
            })
    }

    async bindVk(username) {
        const url = `${this._vkTokenUrl}&state=${username}`
        window.location.replace(url)
    }

    async chartsSearch(searchParams) {
        const params = this._refactor_charts_search_params(searchParams)
        const result = await this._getResponse('charts.search', params)
        if (typeof result !== 'undefined') {
            return this._unpackChartsSearchResult(result)
        }
    }

    async createAutomate(automateParams) {
        const params = this._refactor_automate_params(automateParams)
        await this._getResponse('ads.createAutomate', params)
    }

    async createAnalyzer(artistUrl) {
        const params = {artist_url: artistUrl}
        await this._getResponse('analyzers.add', params)
    }

    async createCampaign(campParams) {
        const params = this._refactor_camp_params(campParams)
        await this._getResponse('ads.createCampaign', params)
    }

    async createGrabber(grabberParams) {
        const params = this._refactor_grabber_params(grabberParams)
        await this._getResponse('grabbers.add', params)
    }

    async createListeners(listenersParams) {
        const params = this._refactor_listeners_params(listenersParams)
        await this._getResponse('users_audios.add', params)
    }

    async createParser(parserParams) {
        const params = this._refactor_parser_params(parserParams)
        await this._getResponse('parsers.add', params)
    }

    async createRelated(relatedParams) {
        const params = this._refactor_related_params(relatedParams)
        await this._getResponse('related.add', params)
    }

    async deleteAnalyzer(analId) {
        return await this._getResponse('analyzers.delete', {id: analId})
    }

    async deleteCampaign(campaignId) {
        return await this._getResponse('ads.deleteCampaign', {id: campaignId})
    }

    async deleteGrabber(grabberId) {
        return await this._getResponse('grabbers.delete', {id: grabberId})
    }

    async deleteListeners(listenersId) {
        return await this._getResponse('users_audios.delete', {id: listenersId})
    }

    async deleteParser(parserId) {
        return await this._getResponse('parsers.delete', {id: parserId})
    }

    async deleteRelated(relatedId) {
        return await this._getResponse('related.delete', {id: relatedId})
    }

    async downloadCampaignStats(campaignId, fileName) {
        await this._getDownloadResponse('ads.downloadCampaignStats', {id: campaignId}, fileName)
    }

    async downloadGrabberResultCsv(grabberId, groupName) {
        const fileName = `${groupName}.csv`
        await this._getDownloadResponse('grabbers.downloadCsv', {id: grabberId}, fileName)
    }

    async downloadListenersResultCsv(listenersId, ticketName) {
        const fileName = `${ticketName}.csv`
        await this._getDownloadResponse('users_audios.downloadCsv', {id: listenersId}, fileName)
    }

    async downloadParsingResult(parserId,  resultPath) {
        const fileName = resultPath.replace('parsing_results/', '')
        await this._getDownloadResponse('parsers.download', {id: parserId}, fileName)
    }

    async downloadParsingResultCsv(parserId, resultPath) {
        const fileName = resultPath.replace('parsing_results/', '').replace('.zip', '.csv')
        await this._getDownloadResponse('parsers.downloadCsv', {id: parserId}, fileName)
    }

    async downloadRelatedResultCsv(relatedId, artistName) {
        const fileName = `${artistName}.csv`
        await this._getDownloadResponse('related.downloadCsv', {id: relatedId}, fileName)
    }

    async getAds(campaignId) {
        const campaign = await this._getResponse('ads.getCampaign', {id: campaignId, extended: 1})
        if (typeof campaign !== "undefined") {
            return this._unpackCampaign(campaign)
        }
    }

    async getAnalyzer(analyzerId) {
        const analyzer = await this._getResponse('analyzers.get', {id: analyzerId, extended: 1})
        if (typeof analyzer !== "undefined") {
            return this._unpackAnalyzer(analyzer)
        }
    }

    async getAnalyzers() {
        const anals = await this._getResponse('analyzers.getAll')
        if (typeof anals !== 'undefined') {
            return this._unpackAnalyzers(anals)
        }
    }

    async getAutomates() {
        const automates = await this._getResponse('ads.getAllAutomates')
        if (typeof automates !== 'undefined') {
            return this._unpackAutomates(automates)
        }
    }

    async getCabsAndGroups() {
        const cabsAndGroups = await this._getResponse('ads.getCabinetsAndGroups')
        if (typeof cabsAndGroups !== 'undefined') {
            return this._unpackCabsAndGroups(cabsAndGroups)
        }
    }

    async getCampaigns() {
        const campaigns = await this._getResponse('ads.getAllCampaigns')
        if (typeof campaigns !== 'undefined') {
            return this._unpackCampaigns(campaigns)
        }
    }

    async getGrabber(grabberId) {
        const grabber = await this._getResponse('grabbers.get', {id: grabberId, extended: 1})
        if (typeof grabber !== "undefined") {
            return this._unpackGrabber(grabber)
        }
    }

    async getGrabbers() {
        const grabbers = await this._getResponse('grabbers.getAll')
        if (typeof grabbers !== 'undefined') {
            return this._unpackGrabbers(grabbers)
        }
    }

    async getListeners(listenersId) {
        const listeners = await this._getResponse('users_audios.get', {id: listenersId, extended: 1})
        if (typeof listeners !== "undefined") {
            return this._unpackListeners(listeners)
        }
    }

    async getListenerses() {
        const listenerses = await this._getResponse('users_audios.getAll')
        if (typeof listenerses !== 'undefined') {
            return this._unpackListenerses(listenerses)
        }
    }

    async getParser(parserId) {
        const parser = await this._getResponse('parsers.get', {id: parserId, extended: 1})
        if (typeof parser !== "undefined") {
            return this._unpackParser(parser)
        }
    }

    async getParsers() {
        const parsers = await this._getResponse('parsers.getAll')
        if (typeof parsers !== 'undefined') {
            return this._unpackParsers(parsers)
        }
    }

    async getRelated(relatedId) {
        const related = await this._getResponse('related.get', {id: relatedId, extended: 1})
        if (typeof related !== "undefined") {
            return this._unpackRelated(related)
        }
    }

    async getRelateds() {
        const relateds = await this._getResponse('related.getAll')
        if (typeof relateds !== 'undefined') {
            return this._unpackRelateds(relateds)
        }
    }

    async getRetarget(cabinet) {
        const retarget = await this._getResponse('ads.getRetarget', cabinet)
        if (typeof retarget !== 'undefined') {
            return this._unpackRetarget(retarget)
        }
    }

    async getUser() {
        const user = await this._getResponse('users.get')
        if (typeof user !== 'undefined') {
            return this._unpackUser(user)
        }
    }

    async login(username, password) {
        const response = await fetch(`${this._apiBaseUrl}users.auth`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            },
            body: JSON.stringify({username: username, password: password})
        })
        if (response.ok) {
            return await response.json()
        }
    }

    async renameCampaign(campaignId, title) {
        const campaign = await this._getResponse('ads.renameCampaign', {id: campaignId, title: title})
        if (typeof campaign !== "undefined") {
            return this._unpackCampaign(campaign)
        }
    }

    async stopAutomate(automateId) {
        await this._getResponse('ads.stopAutomate', {id: automateId})
    }

    async updateAdsStat(campaignId) {
        const campaign = await this._getResponse('ads.updateCampaignStats', {id: campaignId, extended: 1})
        if (typeof campaign !== "undefined") {
            return this._unpackCampaign(campaign)
        }
    }

    async updateSegmentSizes(campaignId) {
        await this._getResponse('ads.updateSegmentSizes', {id: campaignId})
    }


    _refactor_automate_params = (params) => {
        const refactored_params = {
            campaign_id: params.campaign,
            target_cost: params.targetCost,
            type: params.type,
        }
        if (params.startTomorrow) {
            refactored_params.start = 1
        }
        else {
            refactored_params.start = 0
        }
        if (params.finishAutomatically) {
            refactored_params.finish = 0
        } else {
            refactored_params.finish = 1
        }
        return refactored_params
    }

    _refactor_camp_params = (params) => {
        console.log(params)

        let sex = params.sex
        if (params.sex === 'all') {
            sex = ''
        }
        const refactored_params = {
            cabinet_id: params.cabinet,
            group_id: params.group,
            reference_url: params.postUrl,
            money_limit: params.budget,
            sex: sex,
            music: params.musicFilter,
            boom: params.boomFilter,
            age_disclaimer: params.ageDisclaimer,
            age_from: params.ageFrom,
            age_to: params.ageTo,
            musicians: params.musicians,
            groups: params.groupsActive,
            related: params.relatedArtists,
            retarget: params.retargetNames.join('\n'),
            retarget_exclude: params.retargetExclude.join('\n'),
            empty_ads: params.emptyAds,
        }
        if (typeof params.client !== 'undefined') {
            refactored_params.client_id = params.client
        }
        if (typeof params.saveSeen !== 'undefined') {
            refactored_params.retarget_save_seen = params.saveSeen
        }
        if (typeof params.savePositive !== 'undefined') {
            refactored_params.retarget_save_positive = params.savePositive
        }
        if (typeof params.saveNegative !== 'undefined') {
            refactored_params.retarget_save_negative = params.saveNegative
        }
        return refactored_params
    }

    _refactor_charts_search_params = (params) => {
        const refactored_params = {extended: 1}
        if (params.artist) {refactored_params.artist = params.artist}
        if (params.title) {refactored_params.title = params.title}
        if (params.dateFrom) {
            const dateFromArray = params.dateFrom.toLocaleDateString().split('.')
            refactored_params.date_from = `${dateFromArray[2]}-${dateFromArray[1]}-${dateFromArray[0]}`
        }
        if (params.dateTo) {
            const dateToArray = params.dateTo.toLocaleDateString().split('.')
            refactored_params.date_to = `${dateToArray[2]}-${dateToArray[1]}-${dateToArray[0]}`
        }
        return refactored_params
    }

    _refactor_grabber_params = (params) => {
        const dateFromArray = params.dateFrom.toLocaleDateString().split('.')
        const dateToArray = params.dateTo.toLocaleDateString().split('.')
        return {
            group: params.groupUrl,
            with_audio: params.withAudio,
            ads_only: params.adsOnly,
            with_ads: params.withAds,
            date_from: `${dateFromArray[2]}-${dateFromArray[1]}-${dateFromArray[0]}`,
            date_to: `${dateToArray[2]}-${dateToArray[1]}-${dateToArray[0]}`
        }
    }

    _refactor_listeners_params = (params) => {
        return {
            name: params.ticketName,
            type: params.ticketType === 'Треки' ? 'tracks' : 'artists',
            n_last: params.nLast,
            user_ids: params.userIdsArray.join(','),
        }
    }

    _refactor_parser_params = (params) => {
        const param = _need_parser_param(params.method) ? params.param : 1
        return  {[params.method]: param, count_only: params.countOnly ? 1 : 0}
    }

    _refactor_related_params = (params) => {
        return {
            url: params.artistUrl,
            recurse: params.recurse,
            n_releases: params.nReleases,
            listens_min: params.listensMin,
            listens_max: params.listensMax,
            last_days: params.lastDays,
            median_days: params.medianDays
        }
    }

    _unpackAds = (ads) => {
        return ads.map((ad) => {
            return {
                approved: ad.approved,
                status: ad.status,
                name: ad.ad_name,
                spent: ad.spent,
                reach: ad.reach,
                cpm: roundToTwo(ad.cpm),
                listens: ad.listens,
                cpl: roundToTwo(ad.cpl),
                ltr: roundToTwo(ad.lr * 100),
                saves: ad.saves,
                cps: roundToTwo(ad.cps),
                str: roundToTwo(ad.sr * 100),
                adUrl: `https://vk.com/ads?act=office&union_id=${ad.ad_id}`,
                postUrl: `https://vk.com/wall-${ad.post_owner}_${ad.post_id}`,
                audienceCount: ad.audience_count ? ad.audience_count : '—',
                cplCpsRate: ad.cps ? roundToTwo(ad.cpl / ad.cps) : 0
            }
        })
    }

    _unpackAnalyzer = (anal) => {
        return {
            id: anal.id,
            artistName: anal.artist_name,
            photoUrl: anal.photo_url,
            artistUrl: anal.param,
            analysis: anal.result ? anal.result.analysis : null
        }
    }

    _unpackAnalyzers = (anals) => {
        return anals.map((anal) => {
            return {
                analyzerId: anal.id,
                photoUrl: anal.photo_url,
                artistName: anal.artist_name,
                artistUrl: anal.param,
                status: anal.status,
                startDate: anal.start_date,
                finishDate: anal.finish_date
            }
        })
    }

    _unpackAudios = (audios) => {
        return audios.map((audio) => {
            return {
                artist: audio.artist,
                title: audio.title,
                saversCount: audio.savers_count ? audio.savers_count : '0',
                source: audio.source,
                date: audio.date,
                parsingDate: audio.parsing_date,
                mayBeCore: _may_audio_be_core(audio.owner_id, audio.audio_id),
                postUrl: _post_url_for_audio(audio.post_owner_id, audio.post_id),
                chartPosition: audio.chart_position
            }
        })
    }

    _unpackAutomates = (automates) => {
        return automates.map((automate) => {
            return {
                automateId: automate.id,
                campaignId: automate.campaign.campaign_id,
                cover: automate.campaign.cover_url,
                campaign: automate.campaign.campaign_name,
                startValue: _startValue_str_from_int(automate.start),
                stopValue: _stopValue_str_from_int(automate.finish),
                status: automate.status,
                type: _type_str_from_type_int(automate.type),
                count: _count_from_automate(automate),
                vtr: `${(_VTR_from_automate(automate) * 100).toFixed(2)} %` ,
                targetValue: automate.target_cost,
                realValue: _realValue_from_automate(automate),
                reach: automate.campaign.reach,
                spent: roundToTwo(automate.campaign.spent),
                cpm: roundToTwo(automate.campaign.cpm),
                createDate: automate.create_date,
                finishDate: automate.finish_date,
            }
        })
    }

    _unpackCabsAndGroups = (cabsAndGroups) => {
        return {
            cabinets: cabsAndGroups.cabinets.map((cabinet) => {
                return {
                    cabinetType: cabinet.account_type,
                    cabinetId: cabinet.account_id,
                    cabinetName: cabinet.account_name,
                    clientId: cabinet.client_id,
                    clientName: cabinet.client_name
                }
            }),
            groups: cabsAndGroups.groups.map((group) => {
                return {
                    groupName: group.name,
                    groupId: group.id,
                    groupAvaUrl: group.photo_200
                }
            })
        }
    }

    _unpackCampaign = (campaign) => {
        let campStat = {
            campaignId: campaign.campaign_id,
            name: `${campaign.artist} - ${campaign.title}`,
            spent: roundToTwo(campaign.spent),
            reach: campaign.reach,
            cpm: roundToTwo(campaign.cpm),
            listens: campaign.listens,
            cpl: roundToTwo(campaign.cpl),
            ltr: roundToTwo(campaign.lr * 100),
            saves: campaign.saves,
            cps: campaign.cps.toFixed(2),
            str: roundToTwo(campaign.sr * 100),
            cover: campaign.cover_url,
            date: campaign.create_date,
            updateDate: campaign.update_date,
            audienceCount: campaign.audience_count ? campaign.audience_count : '—'
        }
        const adsStat = this._unpackAds(campaign.ads)
        const campAverage = {
            approved: null,
            status: null,
            name: '* КАМПАНИЯ В ЦЕЛОМ *',
            spent: campaign.spent,
            reach: campaign.reach,
            cpm: roundToTwo(campaign.cpm),
            listens: campaign.listens,
            cpl: roundToTwo(campaign.cpl),
            ltr: roundToTwo(campaign.lr * 100),
            saves: campaign.saves,
            cps: roundToTwo(campaign.cps),
            str: roundToTwo(campaign.sr * 100),
            adUrl: null,
            postUrl: null,
            audienceCount: campaign.audience_count ? campaign.audience_count : '—'
        }
        campAverage.cplCpsRate = campAverage.cps ? roundToTwo(campAverage.cpl / campAverage.cps) : 0
        adsStat.unshift(campAverage)
        campStat.ads = adsStat
        return campStat
    }

    _unpackCampaigns = (campaigns) => {
        return campaigns.map((campaign) => {
            return {
                campaignId: campaign.campaign_id,
                status: campaign.status,
                isAutomate: campaign.is_automate ? 1 : 0,
                hasModerateAudios: campaign.has_moderate_audios,
                audiosIsModerated: campaign.audios_is_moderated,
                artist: campaign.artist,
                title: campaign.title,
                name: campaign.campaign_name,
                spent: roundToTwo(campaign.spent),
                reach: campaign.reach,
                cpm: roundToTwo(campaign.cpm),
                listens: campaign.listens,
                cpl: roundToTwo(campaign.cpl),
                ltr: roundToTwo(campaign.lr * 100),
                saves: campaign.saves,
                cps: roundToTwo(campaign.cps),
                str: roundToTwo(campaign.sr * 100),
                cplCpsRate: campaign.cps ? roundToTwo(campaign.cpl / campaign.cps) : 0,
                cover: campaign.cover_url,
                date: campaign.create_date,
                dateFormatted: new Date(campaign.create_date).toLocaleDateString(),
                audienceCount: campaign.audience_count ? campaign.audience_count : '—'
            }
        })
    }

    _unpackChartsSearchResult = (result) => {
        return result.map((release) => {
            return {
                id: release.id,
                artist: release.artist,
                title: release.title,
                coverUrl: release.cover_url,
                positionsCount: release.positions_count,
                positions: release.positions
            }
        })
    }

    _unpackGrabber = (grabber) => {
        return {
            id: grabber.id,
            name: grabber.group_name,
            posts: this._unpackGrabberPosts(grabber.posts)
        }
    }

    _unpackGrabbers = (grabbers) => {
        return grabbers.map((grabber) => {
            return {
                grabberId: grabber.id,
                groupAva: grabber.group_ava,
                groupName: grabber.group_name,
                groupUrl: grabber.group,
                groupLink: grabber.group,
                status: grabber.status,
                withAudio: grabber.with_audio ? 1 : 0,
                adsOnly: grabber.ads_only ? 1 : 0,
                withAds: grabber.with_ads ? 1 : 0,
                dateFrom: grabber.date_from ? new Date(grabber.date_from).toLocaleDateString() : '—',
                dateTo: grabber.date_to ? new Date(grabber.date_to).toLocaleDateString() : '—',
                postsCount: grabber.posts_count,
                startDate: grabber.start_date,
                finishDate: grabber.finish_date
            }
        })
    }

    _unpackGrabberPosts = (posts) => {
        return posts.map((post) => {
            return {
                postUrl: `https://vk.com/wall${post.owner_id}_${post.post_id}`,
                isAd: post.is_ad ? 1 : 0,
                hasAudio: post.has_audios ? 1 : 0,
                hasPlaylist: post.has_playlist ? 1 : 0,
                listens: _get_listens_from_post(post),
                saves: _get_saves_from_post(post),
                doubles: _get_doubles_from_post(post),
                likes: post.likes,
                reposts: post.reposts,
                comments: post.comments,
                postDate: post.date
            }
        })
    }

    _unpackListeners = (listeners) => {
        return {
            id: listeners.id,
            name: listeners.name,
            items: this._unpackListenersItems(listeners.items)
        }
    }

    _unpackListenersItems = (items) => {
        return items.map((item) => {
            return {
                name: item.name,
                shareUsers: item.share_users,
                shareItems: item.share_items,
            }
        })
    }

    _unpackListenerses = (listenerses) => {
        return listenerses.map((item) => {
            return {
                listenersId: item.id,
                name: item.name,
                status: item.status,
                type: item.type === 'tracks' ? 'Треки' : 'Исполнители',
                nLast: item.n_last,
                startDate: item.start_date,
                finishDate: item.finish_date
            }
        })
    }

    _unpackParser = (parser) => {
        return {
            id: parser.id,
            methodName: _parsing_method_name_to_russian(parser.method),
            methodParam: _parsing_method_param_true_to_line(parser.param),
            parsSavers: parser.count_only ? 0 : 1,
            status: parser.status,
            audiosCount: parser.audios_count ? parser.audios_count : '0',
            saversCount: parser.savers_count ? parser.savers_count : '0',
            resultPath: parser.result_path,
            startDate: parser.start_date,
            finishDate: parser.finish_date,
            audios: this._unpackAudios(parser.audios)
        }
    }

    _unpackParsers = (parsers) => {
        return parsers.map((parser) => {
            return {
                id: parser.id,
                methodName: _parsing_method_name_to_russian(parser.method),
                methodParam: _parsing_method_param_true_to_line(parser.param),
                parsSavers: parser.count_only ? 0 : 1,
                status: parser.status,
                audiosCount: parser.audios_count ? parser.audios_count : '0',
                saversCount: parser.savers_count ? parser.savers_count : '0',
                resultPath: parser.result_path ? parser.result_path : null,
                startDate: parser.start_date,
                finishDate: parser.finish_date,
            }
        })
    }

    _unpackRelated = (related) => {
        return {
            id: related.id,
            name: related.artist_name,
            artists: this._unpackRelatedArtists(related.artists)
        }
    }

    _unpackRelateds = (relateds) => {
        return relateds.map((item) => {
            return {
                relatedId: item.id,
                photoUrl: item.photo_url,
                artistName: item.artist_name,
                artistUrl: item.artist_url,
                status: item.status,
                recurse: item.recurse,
                nReleases: item.n_releases,
                lastDays: item.last_days,
                medianDays: item.median_days,
                listensMin: item.listens_min,
                listensMax: item.listens_max,
                relatedCount: item.related_count,
                startDate: item.start_date,
                finishDate: item.finish_date
            }
        })
    }

    _unpackRelatedArtists = (artists) => {
        return artists.map((artist) => {
            return {
                name: artist.name,
                cardLink: artist.card_url,
                cardUrl: artist.card_url,
                groupName: artist.group_name,
                groupUrl: artist.group_url,
                userName: artist.user_name,
                userUrl: artist.user_url
            }
        })
    }

    _unpackRetarget = (retarget) => {
        return retarget.map((item) => {
            return {
                retargetName: item.name,
                retargetId: item.id,
                audienceCount: item.audience_count
            }
        })
    }

    _unpackUser = (user) => {
        return {
            username: user.username,
            avaUrl: user.ava_url,
            balance: user.balance,
            hasToken: user.has_token,
            canAds: user.can_ads,
            canAnalyzers: user.can_analyzers,
            canCharts: user.can_charts,
            canGrabbers: user.can_grabbers,
            canParsers: user.can_parsers,
            canRelated: user.can_related
        }
    }
}