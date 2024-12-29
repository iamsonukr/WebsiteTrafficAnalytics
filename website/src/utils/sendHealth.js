// Frontend utility functions for visitor tracking
import axios from 'axios'
import { useState } from 'react';



let visitedLite=false
let visitedHeavy=false
// Function to get basic health data for lite tracking
const collectLiteHealthData = () => {
    return {
      HealthData: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        windowDimensions: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
  };
  
  // Function to get detailed health data
  const collectDetailedHealthData = () => {
    return {
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height
      },
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  };
  
  // Function to send lite health data
  const sendLiteHealth = async () => {
    try {
      if(!visitedLite){
        visitedLite=true
        const response = await axios.post('http://localhost:5007/api/statics/check-light-health', collectLiteHealthData());
        
        if (response.status === 200) {
          console.log('Lite health data sent successfully');
          return response.data;
        }
      }
    } catch (error) {
      console.error('Error sending lite health data:', error);
      throw error;
    }
  };
  
  // Function to send detailed health data
  const sendDetailHealth = async () => {
    try {
      if(!visitedHeavy){
        visitedHeavy=true
        const response = await axios.post('http://localhost:5007/api/statics/check-heavy-health', collectDetailedHealthData());
        
        if (response.status === 200) {
          console.log('Detailed health data sent successfully');
          return response.data;
        }
      }
    } catch (error) {
      console.error('Error sending detailed health data:', error);
      throw error;
    }
  };

  export {sendDetailHealth ,sendLiteHealth}