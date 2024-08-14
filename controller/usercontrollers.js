const Student = require('../models/StudentSchema'); // Path to your Student model
const User = require('../models/Userschema'); // Path to your User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const express = require('express');
const { check, validationResult } = require("express-validator");
const app = express();
app.use(cookieParser());

// Student Management Controllers

// Add a new student
const addusercontroller = (req, res) => {
    const newStudent = new Student({
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age,
        address: req.body.address
    });

    newStudent.save()
        .then(() => {
            res.render('adduser', { done: 'User has been successfully added' });
            console.log("User successfully saved");
        })
        .catch((error) => {
            res.status(500).send('Error adding student: ' + error);
        });
};

// Find and display all students
const findallusercontroller = (req, res) => {
    Student.find()
        .then((students) => {
            res.render('home', { students: students });
            console.log('All students retrieved successfully');
        })
        .catch((error) => {
            console.error('Error retrieving students:', error);
            res.status(500).send('Error retrieving users: ' + error);
        });
};

// Show details of a specific student
const showusercontroller = (req, res) => {
    Student.findById(req.params.id)
        .then((student) => {
            res.render('user', { student: student });
        })
        .catch((error) => {
            console.error('Error retrieving student:', error);
            res.status(500).send('Error retrieving user: ' + error);
        });
};

// Find a student for editing
const findusercontroller = (req, res) => {
    Student.findById(req.params.id)
        .then((student) => {
            res.render('edit', { student: student });
        })
        .catch((error) => {
            console.error('Error finding student for editing:', error);
            res.status(500).send('Error finding student');
        });
};

// Delete a student
const deleteusercontroller = (req, res) => {
    Student.findByIdAndDelete(req.params.id)
        .then(() => {
            console.log("User deleted successfully");
            res.redirect('/home');
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        });
};

// Update a student's details
const updateusercontroller = (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    Student.findByIdAndUpdate(userId, updatedData, { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send("User not found");
            }
            res.redirect('/home');
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            res.status(500).send("Internal Server Error");
        });
};

// Search for students by name
const searchusercontroller = (req, res) => {
    const name = req.body.name;

    Student.find({ $or: [{ fname: name }, { lname: name }] })
        .then((students) => {
            res.render('home', { students: students });
        })
        .catch((error) => {
            console.error('Error searching users:', error);
            res.status(500).send("Internal Server Error");
        });
};

// Render the add user page
const nachaddusercontroller = (req, res) => {
    res.render('adduser', { done: '' });
};

// Redirect to the home page
const welcomeusercontroller = (req, res) => {
    console.log("Welcome")
    res.render("authen/welcome");
};

// User Authentication Controllers

// Render the signup page
const signupusercontroller = (req, res) => {
    console.log('Rendering signup page');
    res.render('authen/signup');
};

// Render the signin page
const signinusercontroller = (req, res) => {
    console.log('Rendering signin page');
    res.render('authen/signin');
};

// Create a new user
const validationRules = [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password must be at least 8 characters with 1 upper case letter and 1 number").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
];
const createUserController = async (req, res) => {
    try {

        
        const errors = validationResult(req);
        console.log("error"+errors)
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.render('authen/signup', { result: "Invalid email or password" });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render('authen/signup', { result: "Fill all required fields" });
        }

        const existingUser = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

      

        if (existingUser) {
            console.log('Email already in use');
            return res.render('authen/signup', { result: "The email is already in use" });
        }

        if (existingUsername) {
            console.log('Username already in use');
            return res.render('authen/signup', { result: "The Username is already in use" });
        }



        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });

        console.log('User created successfully');
        res.redirect('/signin');
    } catch (err) {
        console.error('Creating user failure:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Handle user login
const loginController = async (req, res) => {
    try {
        const loginUser = await User.findOne({ email: req.body.email });

        if (!loginUser) {
            console.log("Email not found");
            return res.render('authen/signin', { result: "Invalid email" });
        }

        const match = await bcrypt.compare(req.body.password, loginUser.password);

        if (match) {
            console.log("Login successful");
            const token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET || "shhhhh", { expiresIn: '1d' });
            res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
            res.redirect('/home');
        } else {
            console.log("Invalid password");
            res.render('authen/signin', { result: "Invalid password" });
        }
    } catch (err) {
        console.error('Login failure:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || "shhhhh", (err, decodedToken) => {
            if (err) {
                console.log("Token verification failed:", err.message);
                res.redirect("/signin");
            } else {
                console.log("Token verified successfully");
                next();
            }
        });
    } else {
        console.log("No token found");
        res.redirect("/signin");
    }
};

// Middleware to check if a user is logged in
const checkIfUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || "shhhhh", async (err, decoded) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                const loginUser = await User.findById(decoded.id);
                res.locals.user = loginUser;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};


const sinoutcontroller=function (req, res)  {
    res.cookie("jwt", "", {  maxAge: 1 });
    res.redirect("/")
  };

 
module.exports = {
    welcomeusercontroller,
    signupusercontroller,
    signinusercontroller,
    nachaddusercontroller,
    searchusercontroller,
    updateusercontroller,
    deleteusercontroller,
    findusercontroller,
    showusercontroller,
    findallusercontroller,
    addusercontroller,
    createUserController,
    loginController,
    requireAuth,
    checkIfUser,
    sinoutcontroller,
    validationRules
};
