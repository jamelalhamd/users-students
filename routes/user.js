const express = require('express');
const usercontroller = require('../controller/usercontrollers');
const router = express.Router(); // Use Router for modularity

// Route to render the form to add a user
router.get('/adduser', (req, res) => {
    res.render('adduser', {});
    console.log("get adduser");
});

// Route to handle adding a new user
router.post('/adduser', usercontroller.addusercontroller);

// Route to display all users (home page)
router.get('/home', usercontroller.findallusercontroller);

// Route to show a specific user by ID
router.get('/showuser/:id', usercontroller.showusercontroller);

// Route to render the form to edit a user by ID
router.get('/edituser/:id', usercontroller.findusercontroller); // Note: Use `findusercontroller` to load the user for editing

// Route to handle updating a user by ID
router.put('/updateuser/:id', usercontroller.updateusercontroller);

// Route to handle deleting a user by ID
router.delete('/deleteuser/:id', usercontroller.deleteusercontroller);

// Route to handle searching for users by name
router.post('/search', usercontroller.searchusercontroller);
  router.get('/adduser', usercontroller.nachaddusercontroller);


module.exports = router;
