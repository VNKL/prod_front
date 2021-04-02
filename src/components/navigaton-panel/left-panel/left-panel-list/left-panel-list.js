import React from "react";
import List from "@material-ui/core/List";
import LeftPanelListItem from "../left-panel-list-item";


const LeftPanelList = (props) => {

    const {items} = props

    return (
        <List>
            {items.map((item, idx) => <LeftPanelListItem item={item} key={idx}/>)}
        </List>
    )
}

export default LeftPanelList