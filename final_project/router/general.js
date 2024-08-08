const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Axios instance configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000' // Replace with your actual base URL
});

// Task 10: Get the list of books available in the shop
public_users.get('/', async (req, res) => {
    try {
        const response = await axiosInstance.get('/'); // Adjust the endpoint if needed
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axiosInstance.get(`/isbn/${isbn}`); // Adjust the endpoint if needed
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Task 12: Get book details based on Author
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const response = await axiosInstance.get(`/author/${author}`); // Adjust the endpoint if needed
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const response = await axiosInstance.get(`/title/${title}`); // Adjust the endpoint if needed
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

// Get book review (Assuming reviews are included in the book data)
public_users.get('/review/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axiosInstance.get(`/review/${isbn}`); // Adjust the endpoint if needed
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book review", error: error.message });
    }
});

module.exports.general = public_users;
