import React from "react";
import UserMenu from "./user-menu";
import Toolbar from "@material-ui/core/Toolbar";


const UserBlock = (props) => {

    const {user, onBindVk, onUnbindVk} = props

    return (
        <Toolbar>
            <UserMenu user={user} onBindVk={onBindVk} onUnbindVk={onUnbindVk}/>
        </Toolbar>
    )

}

export default UserBlock