const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const session = require('express-session');
const cors = require("cors");
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// MongoDB connection
const MONGO_URI = "mongodb://localhost:27017/ecommerce";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Car schema and model
// Product schema and model
const productSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);


// Secret key for JWT
const SECRET_KEY = "your_secret_key";

// Register API
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// POST endpoint to upload product info
app.post('/uploadProduct', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const { product_name, description, price ,category} = req.body;

  if (!product_name || !description || !price||!category) {
    return res.status(400).json({ error: 'Product name, description, and price are required' });
  }

  const productInfo = new Product({
    imagePath: req.file.path,
    productName: product_name,
    description: description,
    category:category,
    price: parseFloat(price)
  });

  productInfo.save()
    .then(() => res.status(201).json(productInfo))
    .catch(error => res.status(500).json({ message: "Internal server error", error: error.message }));
});

// GET endpoint to retrieve all product data
app.get('/products', async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find();

    // Map over the products to return product data along with image URL
    const productsWithImageUrl = products.map(product => {
      return {
        _id: product._id,
        productName: product.productName,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: `http://localhost:3000/${product.imagePath}`
      };
    });

    res.status(200).json(productsWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

