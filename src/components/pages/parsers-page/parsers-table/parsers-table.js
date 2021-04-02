import React from "react";
import ApiService from "../../../../services/api-service";
import ParsersTableView from "../../../tables/parsers-table-view";
import AudiosPageSkeleton from "../../audios-page/audios-page-skeleton";


export default class ParsersTable extends React.Component {

    state = {
        loading: true,
        parsers: null,
        hasData: false
    }

    api = new ApiService()

    componentDidMount() {
        this.updateParsers()
    }

    updateParsers = () => {
        this.api.getParsers().then(this.onParsersLoaded)
    }

    onParsersLoaded = (parsers) => {
        if (typeof parsers !== 'undefined') {
            this.setState({
                parsers: parsers,
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

    render() {
        const {loading, hasData, parsers} = this.state
        const table = hasData ? <ParsersTableView rows={parsers} /> : null
        const skeleton = loading ? <AudiosPageSkeleton /> : null
        const error = hasData ? null : skeleton ? null : <h2>У тебя еще нет созданных кампаний</h2>

        return (
            <div className='campaigns-page'>
                {skeleton}
                {table}
                {error}
            </div>
        )
    }
}