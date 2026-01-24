import mongoose from "mongoose";
import {createUser, loginUser } from "../controller/user.controller.js";
import express from 'express'
import { jwtAuth } from "../utils/auth.middleware.js";

const userRouter=express.Router()

userRouter.post('/create',jwtAuth,createUser)

userRouter.post('/login',loginUser)


export default userRouter