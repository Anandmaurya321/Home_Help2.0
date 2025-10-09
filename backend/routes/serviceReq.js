
import express from 'express'
const route = express.Router();
import verifyToken from './../middleware/authmiddleware.js'

import addEmailPass from './../controllers/serviceReq/addEmailPass.js'
import addServicePro from './../controllers/serviceReq/addServicePro.js'
import deleteService from './../controllers/serviceReq/deleteService.js'
import register from './../controllers/serviceReq/register.js'
import searchService from './../controllers/serviceReq/searchService.js'
import { Upload  } from '../middleware/uploadImage.js';

route.get('/search_service_req' ,verifyToken , searchService)
route.delete('/deleteservicereq/:id' , verifyToken , deleteService)
route.post('/servicepro_register' , register)
route.put('/addemailpass' , addEmailPass)
route.post('/addservicepro' , Upload , addServicePro) // add middlware for upload::>> and then start doing dsa and development reading and dsa and graph and tree :::>>>

export default route
