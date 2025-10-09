
import express from 'express'
const route = express.Router()
import verifyToken from './../middleware/authmiddleware.js'


import allServicePro from './../controllers/servicePro/all_servicePro.js';
import deleteSevicePro from './../controllers/servicePro/delete_servicePro.js'
import login from './../controllers/servicePro/login.js'
import reviewSection from './../controllers/servicePro/reviewSection.js'
import searchServicePro from './../controllers/servicePro/search_servicePro.js'
import searchById from './../controllers/servicePro/searchById.js'
import validateServicePro from './../controllers/servicePro/validate_servicePro.js'
import viewServicePro from './../controllers/servicePro/view_servicePro.js'
import findServicePro from '../controllers/servicePro/findServicePro.js';
import UpdatePassword from '../controllers/servicePro/updatePassword.js';


route.post('/validateservicePro' , verifyToken , validateServicePro)
route.delete('/deleteservice/:id' , verifyToken , deleteSevicePro)
route.post('/servicepro_login' , login)
route.post('/findServicePro'  , findServicePro);
route.put('/update_ServicePro_Password' , UpdatePassword)
route.get('/viewservicepro/:service', viewServicePro)
route.get('/allservice/:key' , searchServicePro)
route.get('/allservice' , allServicePro)
route.get('/servicepro/:id' , verifyToken , searchById)
route.put('/review/:id', verifyToken , reviewSection);

export default route
