
import express from 'express'
const route = express.Router();
import verifyToken from './../middleware/authmiddleware.js'

import delete_email from './../controllers/user/delete_email.js'
import findUser from './../controllers/user/findUser.js'
import loginUser from './../controllers/user/loginUser.js'
import resendCode from './../controllers/user/resendCode.js'
import saveData from './../controllers/user/saveData.js'
import searchById from './../controllers/user/searchById.js'
import updatePassword from './../controllers/user/updatePassword.js'
import userRegister from './../controllers/user/userRegister.js'
import verifyEmail from './../controllers/user/verifyEmail.js'

route.get('/user/:id' , verifyToken , searchById)
route.post('/register' , userRegister)
route.post('/verifyemail' , verifyEmail)
route.delete('/delete_email/:email' , delete_email)
route.put('/update_password' , updatePassword)
route.post('/save_data' , saveData)
route.post('/login' , loginUser)
route.post('/findUser' , findUser)

export default route
