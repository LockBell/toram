import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {Button, MenuItem, Select, TextField} from "@mui/material";
import {useForm} from "react-hook-form";

export const AdminUser = () => {
    const { id } = useParams();

    return (
        <React.Fragment>
            <TextField label='아이디' disabled={!!id}/>
            <Select variant='outlined'>
                <MenuItem></MenuItem>
            </Select>

            <br/>
            <Button>저장</Button>
        </React.Fragment>
    );
}