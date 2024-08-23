 // Path to your User model
const User = require('../models/Userschema'); // Path to your User model
const jwt = require('jsonwebtoken');
var moment = require('moment');
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
;

const cookieParser = require('cookie-parser');
const express = require('express');
const { check, validationResult } = require("express-validator");
require('dotenv').config();
const app = express();
app.use(cookieParser());


const addusercontroller = async (req, res) => {



    const token = req.cookies.jwt;
    let decoded;
    console.log("token" + token);
    
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
       
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid token');
    }

    try {
        // Find the current user based on token
        const user = await User.findById(decoded.id);
        console.log("user " + user.username);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the current user's information
        user.customerinfo.push({
            fname: req.body.fname,
            lname: req.body.lname,
            age: req.body.age,
            address: req.body.address,
           createdAt: Date.now(),
            updatedAt: Date.now(),
           
        });

        // Save the updated user
       await user.save();
        console.log("User successfully addd");

        res.render('adduser', { done: 'User has been successfully added', authors: user });
    } catch (error) {
        console.error('Error updating User:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).send('Duplicate key error: Email already exists');
        }

        res.status(500).send('Error updating User: ' + error);
    }
};



const findallusercontroller = (req, res) => {
   // Replace 'your_jwt_secret' with your actual secret key
   const token = req.cookies.jwt;
   var decoded = jwt.verify(token, process.env.SECRET_KEY);
   console.log("decoded.id ="+decoded.id) 
   console.log("decoded =", JSON.stringify(decoded, null, 2)); // bar
    User.findById(decoded.id)
        .then((Users) => {
            const customerinfo = Users.customerinfo;
            res.render('home', { Users: customerinfo ,authors:Users,moment : moment });
            console.log('All Users retrieved successfully');
            //console.log(Users.username)
        })



        .catch((error) => {
            console.error('Error retrieving Users:', error);
            res.status(500).send('Error retrieving users: ' + error);
        });
};

// Show details of a specific User
const showusercontroller = (req, res) => {
  


User.findOne({"customerinfo._id":req.params.id})

.then((User) => {
    const customerInfo = User.customerinfo.find(info => info._id.toString() === req.params.id);
 
   res.render('user', { Users: customerInfo ,authors:User,moment : moment});
})
.catch((error) => {
    console.error('Error retrieving User:', error);
    return res.render('authen/signin', { result: "there is problem" });
});



};
const findusercontroller = (req, res) => {
   // User.updateOne( { _id: decoded.id },   { $push: { customerinfo: req.body } }
   //User.updateOne(  {"customerinfo._id":req.params.id},   { $push: { customerinfo: req.body } }
  
    console.log(req.params.id);
    const token = req.cookies.jwt;

    try {
        var decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.redirect('/signin', { result: "Session expired. Please log in again." });
          
        } else {
            return res.status(401).send('Unauthorized: Invalid token');
        }
    }

    User.findById(decoded.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send('User not found');
            }

            // Filter the customerinfo array to find the specific entry by ID
            const customerinfoEntry = user.customerinfo.find(info => info._id.toString() === req.params.id);

            if (!customerinfoEntry) {
                return res.status(404).send('Customer info not found');
            }

            console.log(customerinfoEntry);

            // Render the 'edit' page with the found customerinfo and user details
            res.render('edit', { Users: customerinfoEntry, authors: user,moment : moment });
        })
        .catch((error) => {
            console.error('Error finding User for editing:', error);
            res.status(500).send('Error finding User');
        });
};


// Delete a User
const deleteusercontroller = (req, res) => {
    const token = req.cookies.jwt;
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    User.updateOne({"customerinfo._id":req.params.id},   { $pull: { customerinfo: { _id: req.params.id } } })
    //User.updateOne({_id:decoded.id},   { $pull: { customerinfo: { _id: req.params.id } } })
        .then(() => {
            console.log("User deleted successfully");
            res.redirect('/home');
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        });
};



const updateusercontroller = (req, res) => {
    const customerId = req.params.id;
    const updatedData = req.body;

    // التأكد من أن `updatedAt` يحتوي على قيمة تاريخية صالحة
    updatedData.updatedAt = Date.now(); // أو new Date()

    User.findOneAndUpdate(
        { "customerinfo._id": customerId },
        { $set: { "customerinfo.$": updatedData } },
        { new: true }
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send('لم يتم العثور على العميل');
        }
        console.log("تم تحديث معلومات العميل بنجاح");
        res.redirect('/home');
    })
    .catch((error) => {
        console.error('خطأ في تحديث المستخدم:', error);
        res.status(500).send('خطأ في تحديث المستخدم');
    });
};








// Search for Users by name
const searchusercontroller = (req, res) => {
    const name = req.body.name;
    const token = req.cookies.jwt;
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
   // User.findOne({ $or: [{ fname: name }, { lname: name }] })
   User.findOne({_id:decoded.id })
   .then((Users) => {
    const customerinfo = Users.customerinfo;

    const filteredUsers = customerinfo.filter(info => info.fname.toLowerCase().includes(name.toLowerCase()) || info.lname.toLowerCase().includes(name.toLowerCase()));
    res.render('home', { Users: filteredUsers,authors:Users,moment : moment });
    console.log('All Users retrieved successfully');
    //console.log(Users.username)
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
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.render('authen/signup', { result: "Invalid email or password" });
        }

        const { username, email, password,profileImage } = req.body;

        if (!username || !email || !password) {
            return res.render('authen/signup', { result: "Please fill all required fields" });
        }

        // تنفيذ التحقق من البريد الإلكتروني واسم المستخدم بشكل متوازي
        const [existingUser, existingUsername] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username }),
         
        ]);

        if (existingUser) {
            console.log('Email already in use');
            return res.render('authen/signup', { result: "The email is already in use" });
        }

        if (existingUsername) {
            console.log('Username already in use');
            return res.render('authen/signup', { result: "The Username is already in use" });
        }

  
        await User.create({ username, email, password,profileImage });

        console.log('User created successfully');
        res.redirect('/signin');
    } catch (err) {
        console.error('Creating user failure:', err);
        res.status(500).render('authen/signup', { result: "Internal Server Error, please try again later." });
    }
};


// Handle user login
const loginController = async (req, res) => {
    console.log("beginning login");
    try {
        const loginUser = await User.findOne({ email: req.body.email });

        if (!loginUser) {
            console.log("User not found");
            return res.render('authen/signin', { result: "Invalid email" });
        }

        

        const match = await bcrypt.compare(req.body.password, loginUser.password);
        console.log(" match :" + match);

        if (match) {
            const token = jwt.sign({ id: loginUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
            console.log("redirect to home");
            res.redirect('/home');
        } else {
            console.log(" rerender to authen/signin");
            res.render('authen/signin', { result: "Invalid password" });
        }
    } catch (err) {
        console.error('Login failure:', err);
        res.redirect('/');
    }
};


// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY , (err, decodedToken) => {
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
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
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

//================================================


const multer  = require('multer')
const upload = multer({storage: multer.diskStorage({})});
const cloudinary = require('cloudinary').v2



   

cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME , 
  api_key:process.env.API_KEY , 
  api_secret: process.env.API_SECERT,
});
//================================================


;  // Ensure jwt is required at the top

const post_prifileImage = function (req, res, next) {
    console.log("0");
    console.log("req.file ...>>" + req.file);
    console.log("1");

    cloudinary.uploader.upload(req.file.path,{folder:"jamel_photo"} ,async (error, result) => {
        console.log("============================================")
        if (result) {
            console.log("2");
            console.log(result.secure_url);

            try {  
                var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
                console.log("decoded " +decoded);
                const avatar = await User.updateOne({ _id: decoded.id }, { profileImage: result.secure_url });
                console.log("avatar" +avatar);
                
                res.redirect("/home");
            } catch (err) {
                console.error('JWT verification failed:', err);
                res.redirect("/home");
            }
        } else {
            console.error('Cloudinary upload failed:', error);
            res.status(500).send('Internal Server Error: Cloudinary upload failed');
        }
    });
};




module.exports = {
    welcomeusercontroller,
    post_prifileImage,
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
