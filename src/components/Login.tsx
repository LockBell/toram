import './Login.css'
import {Button, TextField} from "@mui/material";
import React from "react";

export const Login = () => {
    return (
        <React.Fragment>
            <TextField label='아이디' name='id'/>
            <TextField type='password' label='비밀번호' name='password'/>

            <br/>
            <Button>로그인</Button>
        </React.Fragment>
    );
}