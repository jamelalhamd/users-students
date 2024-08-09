const Student = require('../models/StudentSchema'); // Adjust the path to your Student model
const jwt = require('jsonwebtoken');
const User = require('../models/Userschema');
const bcrypt = require('bcrypt'); // Adjust the path
const addusercontroller = (req, res) => {
    const student1 = new Student({
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age,
        address: req.body.address
    });

    student1.save()
        .then(() => {
            res.render('adduser', { done: 'User has been successfully added' });
            console.log("Setup successfully saved");
        })
        .catch((error) => {
            res.status(500).send('Error adding student: ' + error);
        });
};

const findallusercontroller = (req, res) => {
    Student.find()
        .then((students) => {
            res.render('home', { students: students });
            console.log('/views/authen/signup.ejs');
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error retrieving users: ' + error);
        });
};

const showusercontroller = (req, res) => {
    Student.findById(req.params.id)
        .then((student) => {
            res.render('user', { student: student });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error retrieving user: ' + error);
        });
};

const findusercontroller = (req, res) => {
    Student.findById(req.params.id)
        .then((student) => {
            console.log("Edit user done");
            res.render('edit', { student: student });
        })
        .catch((error) => {
            console.log("Edit user error");
            console.log(error);
            res.status(500).send('Error finding student');
        });
};

const deleteusercontroller = (req, res) => {
    Student.findByIdAndDelete(req.params.id)
        .then(() => {
            console.log("User deleted successfully");
            res.redirect('/home'); // Redirect to the list of users after deletion
        })
        .catch((error) => {
            console.log("Error deleting user: ", error);
            res.status(500).send('Error deleting user');
        });
};

const updateusercontroller = (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body; // Assuming the updated data is sent in the request body

    Student.findByIdAndUpdate(userId, updatedData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send("User not found");
            }
            res.redirect('/home'); 
        })
        .catch(error => {
            console.error("Error updating user:", error);
            res.status(500).send("Internal Server Error");
        });
};

const searchusercontroller = (req, res) => {
    const name = req.body.name; // Assuming the search name is sent in the request body

    Student.find({ $or: [{ fname: name }, { lname: name }] })
        .then(students => {
            res.render('home', { students: students });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
};


const nachaddusercontroller=function (req, res)  {
    res.render('/adduser', { done: '' }); // Clear 'done' message for fresh adduser page
  }


  const welcomeusercontroller = function (req, res) {
   res.render('authen/welcome');
   
};







const signinusercontroller = function (req, res) {
    console.log('Rendering signin page');
    res.render('authen/signin'); 
};


const signupusercontroller = function (req, res) {
    console.log('Rendering signup page');
    res.render('authen/signup'); 
};
 







// Ensure User model is imported correctly

// Controller for creating a new user
const createUserController = async function (req, res) {
    try {
        const { username,email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });
        if (existingUser) {
            console.log('Email already in use');
            return res.render('authen/signup', { result: "The email is already in use" });
        }
        if (existingUsername) {
            console.log('Username already in use');
            return res.render('authen/signup', { result: "The Usename is already in use" });
        }
      
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with the hashed password
        await User.create({username, email, password: hashedPassword });

        // Redirect after successful creation
        res.redirect('/signin');
        console.log('User created successfully');
    } catch (err) {
        console.error('Creating user failure:', err);
        res.status(500).send('Internal Server Error');
    }
};





const loginController = async function (req, res) {
    try {
      // Fetch user from database
      const loginUser = await User.findOne({ email: req.body.email });
  
      if (!loginUser) {
        console.log("This email is not found in the database");
        return res.render('authen/signin', { result: "Invalid email" });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const match = await bcrypt.compare(req.body.password, loginUser.password);
  
      if (match) {
        console.log("Correct email & password");
        return res.redirect('/home'); // Redirect to home page on successful login
      } else {
        console.log("Wrong password");
        return res.render('authen/signin', { result: "Invalid password" });
      }
    } catch (err) {
      console.error('Login failure:', err);
      res.status(500).send('Internal Server Error');
    }
  };
  
  



module.exports = {welcomeusercontroller,signupusercontroller,signinusercontroller,
     nachaddusercontroller,
    searchusercontroller,
    updateusercontroller,
    deleteusercontroller,
    findusercontroller,
    showusercontroller,
    findallusercontroller,
    addusercontroller,
    createUserController,
    loginController
};
