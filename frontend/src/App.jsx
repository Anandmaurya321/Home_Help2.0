import { useState , useEffect } from 'react'
import React , {createContext} from 'react' // using createContext hook for creating global data
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import Nav from './pages/general/nav'
import Home_page from './pages/general/homePage'
import AddServiceProvider from './pages/service_pro/addServicePro'
import ViewServicePro from './pages/service_pro/viewServicePro'
import AdminLogin from './pages/admin/adminLogin'
import ValidateService from './pages/admin/validateServicePro'
import AllService from './pages/general/allService'
import ManageService from './pages/admin/manageService'
import { PrivateComponentsforAdmin , PrivateComponentsforLogedIn , PrivateComponentsforOtpSend } from './components/general/privateComponents'
import UserRegister from './pages/user/register'
import UserEmailVeri from './pages/user/verifyEmail'
import GiveReview from './pages/service_pro/reviewSection'
import LoginUser from './pages/user/login'
import UserForgotPassword from './pages/user/userForgotPass'// now for user only:: need to place it in user section instead of general page section ::>>
import ServiceProForgotPassword from './pages/service_pro/serviceProforgotPassword'
import VerifyNewUserPassword from './pages/user/verifyNewPassword'
import VerifyNewServiceProPassword from './pages/service_pro/verifyNewPass'
import AdminVerification from './pages/admin/admin_veri'
import OptionalEmailSetupForServicePro from './pages/service_pro/optionalEmailSetUp'
import VerifyServicePro from './pages/service_pro/verifyServicePro'
import LoginServicePro from './pages/service_pro/login'
import Chat from './pages/messages/messages'
import MyChat from './pages/messages/myChat'
import ChatPage from './pages/messages/chatPage'

import { useDispatch , useSelector } from 'react-redux'
import {loginUser , logoutUser} from './redux/authRedux'
import {jwtDecode} from 'jwt-decode'


function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('loginToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          /// without using react-redox :: localStorage.clear();       
          console.log('Token expired ..... you are logout')
          dispatch(logoutUser());
        }
      }
      catch (err) {
          console.log('facing problem in decoding token');
          return;
      }
    }
  }, [dispatch])


  
  return (
    <>     
    <div className="App">
      <Nav />
      <Routes>
        {/* for everyone */}
        <Route path='/' element={<Home_page/>} />
        <Route path='/allservice' element={<AllService />} />
        <Route path='/viewservicepro' element={<h1><ViewServicePro /></h1>} />
        <Route path='/adminpanel' element={<AdminLogin/>} className="adminpanel" />
        <Route path='/register' element={<UserRegister />} />
        <Route path='/login' element={<LoginUser/>} />
        <Route path='/userforgotpassword' element={<UserForgotPassword/>} />
        <Route path='/serviceproForgotPassword' element={<ServiceProForgotPassword/>} /> {/**need to fix yet */}
        <Route path='/additional_data' element={<OptionalEmailSetupForServicePro />} />
        <Route path='/verify_ser' element={<VerifyServicePro />} />
        <Route path='/servicepro_login' element={<LoginServicePro />} />
        <Route path='/firstMessage' element={<Chat/>} />

        {/* for admin only */}
        <Route element={<PrivateComponentsforAdmin />}>
          <Route path='/validateservice' element={<ValidateService />} />
          <Route path='/manageservice' element={<ManageService />} />
        </Route>

        {/* for LogedIn user */}
        <Route element={<PrivateComponentsforLogedIn />}>
          <Route path='/addservicepro' element={<AddServiceProvider/>} />
          {/* <Route path='/chat' element={<Chat/>}/> */}
          <Route path='/chat' element={<MyChat/>} />
          <Route path='/review/:id' element={<GiveReview />} />
          <Route path='/chat/:chatId' element={<ChatPage />} />
        </Route>


        {/* If otpsend successfully:: then only  :::  */}
        <Route element={<PrivateComponentsforOtpSend />}>
          <Route path='/admin_veri' element={<AdminVerification />} />
          <Route path='/verifyemail' element={<UserEmailVeri/>} />
          {/* we have to create verification page of password for ServicePro also */}
          <Route path='/verifyNewServiceProPassword' element={<VerifyNewServiceProPassword/>}/>
          <Route path='/verifyNewUserPass' element={<VerifyNewUserPassword/>} /> 
        </Route>
      </Routes>
    </div>
    </>
  )
}

export default App



/**
 * Here we are required to route the page for which we have to use reactRouter ::
 * React Router comes due to Link functionality which provide spa :: change the url on only 
 * and the router load the currect page :: do not reload :: 
 */