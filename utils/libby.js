import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import fs from "fs";

dotenv.config();

// you can format the response
export const fMsg = (res, msg, result = {}, statusCode = 200) => {
  res.status(statusCode).json({ con: true, msg, result });
};

//you can encode the password
export const encode = (payload) => {
  return bcrypt.hashSync(payload, 10);
};

//you can decode the password
export const decode = (payload, hash) => {
  return bcrypt.compareSync(payload, hash);
};

// utils/pagination.js
export const paginate = async (model, filter, page = 1, limit = 10) => {
  //have to discus with frontend team to know how much data they want to fetch each time
  try {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Get total user count for pagination info
    const totalItems = await model.countDocuments(filter);

    // Calculate total pages based on total items
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch paginated items from the database
    const items = await model.find(filter).skip(skip).limit(limit);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error in pagination: " + error.message);
  }
};

// generate random code with 4 characters
export const generateCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  let result = "";
  while (counter < 4) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

// This function generates a JSON Web Token (JWT) for a given user_id and sets it as a cookie in the response.
export const generateTokenAndSetCookie = (res, user_id) => {
    // Sign a JWT with the user_id and a secret key, set to expire in 30 days.
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    // Set the JWT as a cookie in the response, with security features to prevent XSS and ensure it's sent over HTTPS in development.
    res.cookie('jwt', token, {
        httpOnly: true, // prevent XSS
        sameSite: 'None',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
       
    });
};

// Middleware to validate JWT
export const validateToken = (req, res, next) => {
    const token = req.cookies.jwt; // Get token from cookies
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ con: false, msg: "No token provided" }); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { 
        if (err) {
            console.log("Invalid token");
            return res.status(403).json({ con: false, msg: "Invalid token" }); // Invalid token
        }
        req.userId = decoded.id; // Store user ID in request
        next(); // Proceed to the next middleware
    });
};
