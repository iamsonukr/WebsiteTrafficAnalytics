import mongoose from "mongoose";
import {getVisitorLiteDetails ,getVisitorDetails, getHeavyStatistics} from "../controller/visitor.controller.js";
import express from 'express'

const visitorRouter=express.Router()

visitorRouter.post('/check-light-health',getVisitorLiteDetails)

visitorRouter.post('/check-heavy-health',getVisitorDetails)

visitorRouter.get('/display-health',getHeavyStatistics)


export default visitorRouter