const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors({
  origin: ['https://socialsapps.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Serve static files with proper headers
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

// Test route to check uploads
app.get("/test-uploads", (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(__dirname, 'uploads');
  
  try {
    const files = fs.readdirSync(uploadsDir);
    res.json({ 
      message: "Uploads directory accessible", 
      files: files,
      uploadsPath: uploadsDir
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Cannot access uploads directory", 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});
