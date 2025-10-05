
import {Navigate , Outlet} from 'react-router-dom'


const PrivateComponentsforAdmin = ()=>{
    const data  = localStorage.getItem('isAdmin');
    return data ? <Outlet/>  : <Navigate to="/adminpanel"/>
}


const PrivateComponentsforOtpSend = ()=>{
    const data  = localStorage.getItem('otpSend');
    return data ? <Outlet/>  : <Navigate to="/register"/>
}


const PrivateComponentsforLogedIn = ()=>{
    const data  = localStorage.getItem('isLoggedIn');
    return data ? <Outlet/>  : <Navigate to="/register"/>
}


export  {PrivateComponentsforLogedIn ,  PrivateComponentsforOtpSend , PrivateComponentsforAdmin}



