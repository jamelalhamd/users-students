const express = require('express');
const usercontroller = require('../controller/usercontrollers');
const router = express.Router(); // Use Router for modularity
router.get('/',usercontroller.requireAuth, usercontroller.welcomeusercontroller);
// Route to render the form to add a user
router.get('/adduser',usercontroller.requireAuth, (req, res) => {
    res.render('adduser', {});
    console.log("get adduser");
});

// Route to handle adding a new user
router.post('/adduser', usercontroller.addusercontroller);

// Route to display all users (home page)
router.get('/home', usercontroller.findallusercontroller);

// Route to show a specific user by ID
router.get('/showuser/:id',usercontroller.requireAuth, usercontroller.showusercontroller);

// Route to render the form to edit a user by ID
router.get('/edituser/:id',usercontroller.requireAuth, usercontroller.findusercontroller); // Note: Use `findusercontroller` to load the user for editing

// Route to handle updating a user by ID
router.put('/updateuser/:id', usercontroller.updateusercontroller);

// Route to handle deleting a user by ID
router.delete('/deleteuser/:id',usercontroller.requireAuth, usercontroller.deleteusercontroller);

// Route to handle searching for users by name
router.post('/search', usercontroller.searchusercontroller);
  router.get('/adduser', usercontroller.nachaddusercontroller);

  router.get('/signup', usercontroller.signupusercontroller);
  router.get('/signin', usercontroller.signinusercontroller);
  router.post('/signup', usercontroller.createUserController);
  router.post('/login', usercontroller.loginController);
module.exports = router;
