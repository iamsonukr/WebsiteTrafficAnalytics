import { PaymentDueModel } from "../models/paymentDue.model.js";

/* CREATE */
export const createPaymentDue = async (req, res) => {
  try {
    let createdBy = req.body.userId;
    req.body.createdBy = createdBy;
    console.log("Creating Payment Due with data:", req.body);
    const payment = await PaymentDueModel.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/* READ – all (optionally for homepage) */
export const getAllPaymentDues = async (req, res) => {
  try {
    const userId = req.body.userId;
    
    // Validate userId
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "userId is required" 
      });
    }
    
    console.log("Fetching Payment Dues for user:", userId);
    
    // Build filter - always filter by userId for security
    const filter = { createdBy: userId };
    
    if (req.query.homepage === "true") {
      filter.paymentComplete = false;
      filter.showOnHomepage = true;
    }

    const payments = await PaymentDueModel.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payment dues:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* READ – single */
export const getSinglePaymentDue = async (req, res) => {
  try {
    const payment = await PaymentDueModel.findById(req.params.id);
    if (!payment)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* UPDATE */
export const updatePaymentDue = async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    const payment = await PaymentDueModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payment)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/* DELETE */
// export const deletePaymentDue = async (req, res) => {
//   try {
//     const payment = await PaymentDueModel.findByIdAndDelete(req.params.id);
//     if (!payment)
//       return res.status(404).json({ success: false, message: "Not found" });

//     res.status(200).json({ success: true, message: "Deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
