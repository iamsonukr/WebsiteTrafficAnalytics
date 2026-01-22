import { checkReturningVisitor, generateVisitorId, getLocationFromIP, parseUserAgent } from "../utils/visitorHelpers.js";

import {VisitorLiteModel, VisitorAllModel} from "../models/visitor.model.js";

const getVisitorLiteDetails= async (req, res) => {
    try {
      const visitorData = req.body.HealthData;
      console.log(req.body.HealthData)
  
      // Save the minimal visitor data
      const visitor = new VisitorLiteModel(visitorData);
      await visitor.save();
  
      res.status(200).json({ message: 'Visitor tracked successfully' });
    } catch (error) {
      console.error('Error tracking visitor:', error);
      res.status(500).json({ error: 'Failed to track visitor' });
    }
  };


  const getVisitorDetails = async (req, res) => {
    try {
      const userAgent = req.headers['user-agent'];
      const ip = req.ip || req.connection.remoteAddress;
      
      // Extract browser data using user-agent parser (you'll need to install a package like 'ua-parser-js')
      const visitorData = {
        userAgent: parseUserAgent(userAgent), // You'll need to implement this
        location: await getLocationFromIP(ip), // You'll need to implement this
        sessionDuration: 0, // Will be updated on session end
        pageViews: 1,
        entryPage: req.headers.referer || 'direct',
        referrer: req.headers.referer,
        screenResolution: req.body.screenResolution,
        language: req.headers['accept-language'],
        visitorId: generateVisitorId(req), // You'll need to implement this
        returningVisitor: checkReturningVisitor(req) // You'll need to implement this
      };
      console.log(visitorData,ip)
  
      const visitor = new VisitorAllModel(visitorData);
      await visitor.save();
  
      res.status(200).json({ message: 'Visit tracked successfully' });
    } catch (error) { 
      console.error('Error tracking visitor:', error);
      res.status(500).json({ error: 'Failed to track visitor' });
    }
  };
  

  const getHeavyStatistics = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Build date range filter
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
      }
  
      // Aggregate visitor statistics
      const statistics = await VisitorAllModel.aggregate([
        { $match: dateFilter },
        {
          $facet: {
            // Device breakdown
            deviceStats: [
              { $group: {
                _id: '$userAgent.deviceType',
                count: { $sum: 1 }
              }}
            ],
            // Browser statistics
            browserStats: [
              { $group: {
                _id: '$userAgent.browser',
                count: { $sum: 1 }
              }}
            ],
            // Geographic distribution
            locationStats: [
              { $group: {
                _id: '$location.country',
                visitors: { $sum: 1 }
              }}
            ],
            // Time-based metrics
            timeStats: [
              { $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }},
                dailyVisitors: { $sum: 1 },
                avgSessionDuration: { $avg: '$sessionDuration' }
              }}
            ],
            // Overall metrics
            overall: [
              { $group: {
                _id: null,
                totalVisitors: { $sum: 1 },
                uniqueVisitors: { $addToSet: '$visitorId' },
                avgPageViews: { $avg: '$pageViews' },
                returningVisitors: { 
                  $sum: { $cond: ['$returningVisitor', 1, 0] }
                }
              }}
            ]
          }
        }
      ]);
  
      res.status(200).json({
        analytics: statistics[0],
        timeframe: {
          start: startDate || 'all time',
          end: endDate || 'present'
        }
      });
    } catch (error) {
      console.error('Error fetching visitor statistics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch visitor statistics',
        details: error.message 
      });
    }
  };
  
  export {getVisitorLiteDetails ,getVisitorDetails, getHeavyStatistics}
  