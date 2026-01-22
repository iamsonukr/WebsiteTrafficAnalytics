import mongoose from "mongoose";
import {getVisitorLiteDetails ,getVisitorDetails, getHeavyStatistics} from "../controller/visitor.controller.js";
import express from 'express'
import { authorizeRoles, jwtAuth } from "../utils/auth.middleware.js";

const visitorRouter=express.Router()

visitorRouter.post('/check-light-health',getVisitorLiteDetails)

visitorRouter.post('/check-heavy-health',getVisitorDetails)

visitorRouter.get('/display-health',jwtAuth,getHeavyStatistics)


export default visitorRouter