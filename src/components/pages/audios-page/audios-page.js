import React from "react";
import Grid from "@material-ui/core/Grid";
import ApiService from "../../../services/api-service";
import AudiosTableView from "../../tables/audios-table-view";
import AudiosPageSkeleton from "./audios-page-skeleton";


export default class AudiosPage extends React.Component {

    state = {
        parserId: null,
        resultPath: null,
        loading: true,
        audios: null,
        needChart: false,
        needPost: false,
        fromNewReleases: false,
        hasData: false,
        hasCsv: false
    }
    api = new ApiService()

    parserId = this.props.parserId

    componentDidMount() {
        this.loadParser()
    }

    loadParser = () => {
        this.api.getParser(this.parserId).then(this.onParserLoaded)
    }

    onParserLoaded = (parser) => {
        if (typeof parser !== 'undefined') {
            this.setState({
                hasCsv: !!parser.resultPath,
                resultPath: parser.resultPath,
                parserId: parser.id,
                audios: parser.audios,
                needChart: parser.methodName === 'Чарт ВК',
                needPost: !(
                    parser.methodName === 'Новинки ВК' ||
                    parser.methodName === 'Аудиозаписи сообщества' ||
                    parser.methodName === 'Чарт ВК' ||
                    parser.methodName === 'Аудиозаписи плейлиста' ||
                    parser.methodName === 'Неизвестный метод'
                ),
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

    handleDownload = () => {
        if (this.state.hasCsv) {
            this.api.downloadParsingResultCsv(this.state.parserId, this.state.resultPath)
        }
    }

    render() {

        const {loading, hasData, audios, needChart, needPost, hasCsv } = this.state
        const table = hasData ? <AudiosTableView rows={audios}
                                                 needChart={needChart}
                                                 needPost={needPost}
                                                 handleDownload={this.handleDownload}
                                                 hasCsv={hasCsv} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>Ошибка с получением данных</h2>

        return (
            <Grid container spacing={3} alignItems='center'>

                <Grid item xs={12}>
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