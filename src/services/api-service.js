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

export function dateStrFromParam(param) {
    if (param) {
        return new Date(param).toLocaleString()
    } else {
        return '-'
    }
}

export function spacedNumber(x) {
    if (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}


export default class ApiService {
    // _apiBaseUrl = 'http://77.223.106.195:70/api/'
    _apiBaseUrl = 'http://127.0.0.1:8000/api/'
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

    async createAutomate(automate_params) {
        const params = this._refactor_automate_params(automate_params)
        await this._getResponse('ads.createAutomate', params)
    }

    async createCampaign(camp_params) {
        const params = this._refactor_camp_params(camp_params)
        await this._getResponse('ads.createCampaign', params)
    }

    async createParser(parser_params) {
        const params = this._refactor_parser_params(parser_params)
        await this._getResponse('parsers.add', params)
    }

    async createRelated(related_params) {
        const params = this._refactor_related_params(related_params)
        await this._getResponse('related.add', params)
    }

    async deleteCampaign(campaignId) {
        return await this._getResponse('ads.deleteCampaign', {id: campaignId})
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
            empty_ads: params.emptyAds
        }
        if (typeof params.client !== 'undefined') {
            refactored_params.client_id = params.client
        }
        return refactored_params
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
                spent: ad.spent ? roundToTwo(ad.spent) : '0.00',
                reach: ad.reach ? ad.reach : '0',
                cpm: roundToTwo(ad.cpm),
                listens: ad.listens ? ad.listens : '0',
                cpl: roundToTwo(ad.cpl),
                ltr: roundToTwo(ad.lr * 100),
                saves: ad.saves ? ad.saves : '0',
                cps: roundToTwo(ad.cps),
                str: roundToTwo(ad.sr * 100),
                adUrl: `https://vk.com/ads?act=office&union_id=${ad.ad_id}`,
                postUrl: `https://vk.com/wall-${ad.post_owner}_${ad.post_id}`,
                audienceCount: ad.audience_count ? ad.audience_count : '—'
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
            listens: campaign.listens ? campaign.listens : '0',
            cpl: roundToTwo(campaign.cpl),
            ltr: roundToTwo(campaign.lr * 100),
            saves: campaign.saves ? campaign.saves : '0',
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
            name: '*** КАМПАНИЯ В ЦЕЛОМ ***',
            spent: campaign.spent ? roundToTwo(campaign.spent) : '0',
            reach: campaign.reach ? campaign.reach : '0',
            cpm: roundToTwo(campaign.cpm),
            listens: campaign.listens ? campaign.listens : '0',
            cpl: roundToTwo(campaign.cpl),
            ltr: roundToTwo(campaign.lr * 100),
            saves: campaign.saves ? campaign.saves : '0',
            cps: campaign.cps.toFixed(2),
            str: roundToTwo(campaign.sr * 100),
            adUrl: null,
            postUrl: null,
            audienceCount: campaign.audience_count ? campaign.audience_count : '—'
        }
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
                spent: campaign.spent ? roundToTwo(campaign.spent) : '0',
                reach: campaign.reach ? campaign.reach : '0',
                cpm: roundToTwo(campaign.cpm),
                listens: campaign.listens ? campaign.listens : '0',
                cpl: roundToTwo(campaign.cpl),
                ltr: roundToTwo(campaign.lr * 100),
                saves: campaign.saves ? campaign.saves : '0',
                cps: roundToTwo(campaign.cps),
                str: roundToTwo(campaign.sr * 100),
                cover: campaign.cover_url,
                date: campaign.create_date,
                dateFormatted: new Date(campaign.create_date).toLocaleDateString(),
                audienceCount: campaign.audience_count ? campaign.audience_count : '—'
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