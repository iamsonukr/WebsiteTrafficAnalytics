import express from 'express'
import { createPaymentDue, getAllPaymentDues,getSinglePaymentDue,updatePaymentDue } from '../controller/paymentDue.controller.js';
import { jwtAuth } from '../utils/auth.middleware.js';

const paymentDueRouter=express.Router()

paymentDueRouter.post("/payment-due",jwtAuth, createPaymentDue);
paymentDueRouter.get("/payment-due",jwtAuth, getAllPaymentDues);
paymentDueRouter.put("/payment-due/:id",jwtAuth, updatePaymentDue);

// public route
paymentDueRouter.get("/site-config/:id", getSinglePaymentDue);


// paymentDueRouter.delete("/payment-due/:id", deletePaymentDue);


export default paymentDueRouter