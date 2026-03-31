import express from 'express';
//import the educatorController function you have created that is updateRoleToEducator
import { addCourse, getEducatorCourses, updateRoleToEducator } from '../controllers/educatorControllers.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middleware/authMiddleware.js';

//create a router using express
const educatorRouter = express.Router();

//Add Educator Role
educatorRouter.get('/update-role',updateRoleToEducator)
//Add Course Role
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)
//Get AllCourses by a particular educatorId
educatorRouter.get('/courses',protectEducator,getEducatorCourses)
export default educatorRouter //After exporting it we will provide it in our server.js file