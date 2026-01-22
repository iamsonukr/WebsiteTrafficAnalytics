import mongoose from "mongoose";

const paymentDueSchema = new mongoose.Schema(
  {
    clientName: {
        type: String,
    },

    website: {
      type: String,
      required: true,
      trim: true,
    },

    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    paymentComplete: {
      type: Boolean,
      default: false,
      index: true,
    },

    messageTitle: {
      type: String,
      default: "Payment Pending",
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    showOnHomepage: {
      type: Boolean,
      default: true,
    },

    lastReminderSentAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const PaymentDueModel = mongoose.model(
  "PaymentDue",
  paymentDueSchema
);
