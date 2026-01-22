import mongoose from "mongoose";
import {createUser, loginUser } from "../controller/user.controller.js";
import express from 'express'

const userRouter=express.Router()

userRouter.post('/create',createUser)

userRouter.post('/login',loginUser)


export default userRouter