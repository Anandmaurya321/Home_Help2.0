
import express from 'express'
const route = express.Router();
import verifyToken from './../middleware/authmiddleware.js'


import admin from './../controllers/admin/admin.js'

route.post('/adminpanel' , admin);

export default route