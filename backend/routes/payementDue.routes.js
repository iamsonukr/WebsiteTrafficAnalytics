import express from 'express'
import { createPaymentDue, getAllPaymentDues,getSinglePaymentDue,updatePaymentDue } from '../controller/paymentDue.controller.js';

const paymentDueRouter=express.Router()

paymentDueRouter.post("/payment-due", createPaymentDue);
paymentDueRouter.get("/payment-due", getAllPaymentDues);
paymentDueRouter.get("/site-config/:id", getSinglePaymentDue);
paymentDueRouter.put("/payment-due/:id", updatePaymentDue);


// paymentDueRouter.delete("/payment-due/:id", deletePaymentDue);


export default paymentDueRouter