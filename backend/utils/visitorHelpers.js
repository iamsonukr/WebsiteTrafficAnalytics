import {UAParser} from 'ua-parser-js';
import geoip from 'geoip-lite'
import crypto from 'crypto'

// Parse user agent string to get browser and device info
const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown',
    browserVersion: result.browser.version || 'Unknown',
    os: result.os.name || 'Unknown',
    deviceType: result.device.type || 'desktop' // default to desktop if not detected
  };
};

// Get location information from IP address
const getLocationFromIP = async (ip) => {
  try {
    // Remove IPv6 localhost prefix if present
    const cleanIP = ip.replace(/^::ffff:/, '');
    
    // Don't lookup for localhost/private IPs
    if (cleanIP === '127.0.0.1' || cleanIP === 'localhost') {
      return {
        country: 'LOCAL',
        city: 'LOCAL',
        timezone: 'LOCAL'
      };
    }

    const geoData = geoip.lookup(cleanIP);
    
    return {
      country: geoData?.country || 'Unknown',
      city: geoData?.city || 'Unknown',
      timezone: geoData?.timezone || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: 'Unknown'
    };
  }
};

// Generate a unique visitor ID
const generateVisitorId = (req) => {
  // Combine multiple factors to generate a unique ID
  const factors = [
    req.headers['user-agent'],
    req.ip,
    req.headers['accept-language'],
    // Add a random component to handle same-device multiple users
    Math.random().toString()
  ].join('|');

  // Create SHA-256 hash of the factors
  return crypto
    .createHash('sha256')
    .update(factors)
    .digest('hex');
};

// Check if this is a returning visitor using cookies
const checkReturningVisitor = (req) => {
  try {
    // Check for existing visitor cookie
    const visitorCookie = req.cookies?.visitorId;
    
    if (visitorCookie) {
      return true;
    }

    // If no cookie found, this is a new visitor
    return false;
  } catch (error) {
    console.error('Error checking returning visitor:', error);
    return false;
  }
};

// Track session duration
const startSession = () => {
  return Date.now();
};

const calculateSessionDuration = (startTime) => {
  return Date.now() - startTime;
};

// Main visitor data collection function
const collectVisitorData = async (req) => {
  const userAgent = req.headers['user-agent'];
  const ip = req.ip || req.connection.remoteAddress;
  
  const visitorData = {
    userAgent: parseUserAgent(userAgent),
    location: await getLocationFromIP(ip),
    sessionDuration: 0, // Will be updated when session ends
    pageViews: 1,
    entryPage: req.headers.referer || 'direct',
    referrer: req.headers.referer,
    screenResolution: req.body.screenResolution || {
      width: null,
      height: null
    },
    language: req.headers['accept-language']?.split(',')[0] || 'Unknown',
    visitorId: generateVisitorId(req),
    returningVisitor: checkReturningVisitor(req)
  };

  return visitorData;
};

// Example usage in your controller
const trackVisitor = async (req, res) => {
  try {
    const visitorData = await collectVisitorData(req);
    
    // Set cookie for returning visitor tracking
    if (!req.cookies?.visitorId) {
      res.cookie('visitorId', visitorData.visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // Save to database
    const visitor = new VisitorModel(visitorData);
    await visitor.save();

    res.status(200).json({ message: 'Visit tracked successfully' });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
};

// Required middleware for cookie handling
const cookieMiddleware = () => {
  return require('cookie-parser')();
};

export {
  parseUserAgent,
  getLocationFromIP,
  generateVisitorId,
  checkReturningVisitor,
  collectVisitorData,
  trackVisitor,
  cookieMiddleware
};