const express = require('express');
const { check, validationResult } = require("express-validator");
const usercontroller = require('../controller/usercontrollers');
const router = express.Router();



//================================================


const multer  = require('multer')
const upload = multer({storage: multer.diskStorage({})});
const cloudinary = require('cloudinary').v2


//================================================
















// Use Router for modularity
router.get('/',usercontroller.checkIfUser,usercontroller.requireAuth, usercontroller.welcomeusercontroller);

// Route to render the form to add a user
router.get('/adduser',usercontroller.requireAuth,usercontroller.checkIfUser, (req, res) => {
    res.render('adduser', {authors:  res.locals.user});
  
});

// Route to handle adding a new user
router.post('/adduser',usercontroller.checkIfUser, usercontroller.addusercontroller);

// Route to display all users (home page)
//router.get('/home',usercontroller.checkIfUser,usercontroller.requireAuth, usercontroller.findallusercontroller);
router.get('/home',usercontroller.checkIfUser, usercontroller.requireAuth,usercontroller.findallusercontroller);
// Route to show a specific user by ID
router.get('/showuser/:id',usercontroller.checkIfUser, usercontroller.showusercontroller);

// Route to render the form to edit a user by ID
router.get('/edituser/:id',usercontroller.checkIfUser, usercontroller.findusercontroller); // Note: Use `findusercontroller` to load the user for editing

// Route to handle updating a user by ID
router.put('/updateuser/:id', usercontroller.updateusercontroller);

// Route to handle deleting a user by ID
router.delete('/deleteuser/:id',usercontroller.requireAuth, usercontroller.deleteusercontroller);

// Route to handle searching for users by name
router.post('/search',usercontroller.checkIfUser, usercontroller.searchusercontroller);
  router.get('/adduser', usercontroller.nachaddusercontroller);

  router.get('/signup', usercontroller.signupusercontroller);
  router.get('/signin', usercontroller.signinusercontroller);


  router.post('/signup',usercontroller.validationRules, usercontroller.createUserController);

  router.post('/login', usercontroller.loginController);

  router.get("*",usercontroller.checkIfUser);
  router.get('/logout', usercontroller.sinoutcontroller);


 // router.post("/update-profile",usercontroller.uploadphotocontroller );
 router.post("/update-profile", upload.single('avatar'),usercontroller.post_prifileImage );


module.exports = router;
