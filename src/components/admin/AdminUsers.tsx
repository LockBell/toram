import React from "react";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

export const AdminUsers = () => {
    return (
        <React.Fragment>
            유저
            <Button><Link to='create' >생성</Link></Button>
        </React.Fragment>
    );
}