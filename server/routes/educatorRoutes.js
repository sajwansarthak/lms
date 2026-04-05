import express from 'express';
//import the educatorController function you have created that is updateRoleToEducator
import { addCourse, getEducatorCourses, getEducatorDashboardData, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorControllers.js';
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
//Get Educator dashboard data
educatorRouter.get('/dashboard',protectEducator,getEducatorDashboardData)
//Get Enrolled Students Data
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)
export default educatorRouter //After exporting it we will provide it in our server.js file