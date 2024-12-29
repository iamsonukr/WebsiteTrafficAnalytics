
import mongoose from 'mongoose';

// MongoDB Schema for automatically collected visitor data
const visitorAllSchema = new mongoose.Schema({
  // Browser and Device Info
  userAgent: {
    browser: String,
    browserVersion: String,
    os: String,
    deviceType: String, // mobile, tablet, desktop
  },
  // Location Data (from IP)
  location: {
    country: String,
    city: String,
    timezone: String,
  },
  // Session Info
  sessionDuration: Number,
  pageViews: Number,
  entryPage: String,
  exitPage: String,
  referrer: String,
  // Technical Details
  screenResolution: {
    width: Number,
    height: Number
  },
  language: String,
  // Timestamps
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  // Visitor Identification
  visitorId: String, // Anonymized identifier
  returningVisitor: Boolean,
}, {
  timestamps: true
});

const VisitorAllModel = mongoose.model('VisitorAll', visitorAllSchema);

export default VisitorAllModel