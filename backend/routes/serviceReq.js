
import express from 'express'
const route = express.Router();
import verifyToken from './../middleware/authmiddleware.js'

import addEmailPass from './../controllers/serviceReq/addEmailPass.js'
import addServicePro from './../controllers/serviceReq/addServicePro.js'
import deleteService from './../controllers/serviceReq/deleteService.js'
import register from './../controllers/serviceReq/register.js'
import searchService from './../controllers/serviceReq/searchService.js'

import multer from 'multer'
import { storage } from '../config/cloudinary.js';
const upload = multer({storage});


route.get('/search_service_req' ,verifyToken , searchService)
route.delete('/deleteservicereq/:id' , verifyToken , deleteService)
route.post('/servicepro_register' , register)
route.put('/addemailpass' , addEmailPass)
route.post('/addservicepro' , upload.single('image') , addServicePro)

export default route
