import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

const jwtAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log("This is token and this is ",req.body, req.file)
  // return  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    const user = await UserModel.findById(decoded.id); // Use decoded.id or decoded.userId based on your token structure
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Attach user to request
    req.user = user;
    req.body.userId = user._id.toString();
    // console.log("This is admin id",req.body.userId)
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient role."
      });
    }
    next();
  };
};


export {jwtAuth, authorizeRoles} ;