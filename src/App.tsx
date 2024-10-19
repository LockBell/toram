import './App.css'
import {Outlet, Route, Routes} from "react-router-dom";
import {Statting} from "./components/Statting.tsx";
import {createTheme, ThemeProvider, useColorScheme} from "@mui/material";
import {Admin} from "./components/Admin.tsx";
import {Login} from "./components/Login.tsx";
import {AdminUsers} from "./components/admin/AdminUsers.tsx";
import {AdminUser} from "./components/admin/users/AdminUser.tsx";

function App() {
    const { mode, setMode } = useColorScheme();
    setMode('system');

    const theme = createTheme({
        colorSchemes: {
            dark: true
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path='statting' element={<Statting/>}/>
                <Route path='admin' element={<Outlet/>}>
                    <Route path='' element={<Admin/>}/>
                    <Route path='users' element={<Outlet/>}>
                        <Route path='' element={<AdminUsers/>}/>
                        <Route path='create' element={<AdminUser/>} id='create'/>
                        <Route path=':id' element={<AdminUser/>}/>
                        <Route path=':id/edit' element={<AdminUser/>}/>
                    </Route>
                </Route>
                <Route path='/login' element={<Login/>}/>
            </Routes>
            <footer>
                <p>
                    <a>개인정보 처리 방침</a>
                    <a>사이트 이용 약관</a>
                    <span className='copy-right'>
                        &copy;&nbsp;Copyright 2024 슬기로운 토람
                    </span>
                </p>
            </footer>
        </ThemeProvider>
    )
}

export default App