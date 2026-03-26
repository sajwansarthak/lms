import express from 'express';
//import the educatorController function you have created that is updateRoleToEducator
import { updateRoleToEducator } from '../controllers/educatorControllers.js';

//create a router using express
const educatorRouter = express.Router();

//Add Educator Role
educatorRouter.get('/update-role',updateRoleToEducator)

export default educatorRouter //After exporting it we will provide it in our server.js file