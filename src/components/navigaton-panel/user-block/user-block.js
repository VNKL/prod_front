import React from "react";
import UserMenu from "./user-menu";
import Toolbar from "@material-ui/core/Toolbar";


const UserBlock = (props) => {

    const {user, onBindVk} = props

    return (
        <Toolbar>
            <UserMenu user={user} onBindVk={onBindVk}/>
        </Toolbar>
    )

}

export default UserBlock