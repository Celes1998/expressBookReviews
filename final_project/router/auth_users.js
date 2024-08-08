const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();

const secret = 'your_jwt_secret'; // Replace with a strong secret

let users = []; // In-memory user storage

// Function to check if the username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to check if the username and password match
const authenticatedUser = (username, password) => {
    const user = users.find(u => u.username === username);
    if (user) {
        return bcrypt.compareSync(password, user.password);
    }
    return false;
};

// Function to authenticate the user
const authenticateToken = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = user; // Store the user information in the request object
        next();
    });
};

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: "User successfully registered" });
});

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    req.session.token = token; // Store the token in the session
    res.json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.user.username; // Get the username from the token

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or modify the review
    book.reviews[username] = review;
    res.json({ message: "Review added/modified successfully", book });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Get the username from the token

  const book = books[isbn];
  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete book.reviews[username];

  res.json({ message: "Review deleted successfully", book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
