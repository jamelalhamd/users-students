const express = require('express')


const methodOverride = require('method-override');


// Middleware to override methods


const app = express()

app.use(methodOverride('_method'));
const port = 3000
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
const Student = require('./models/StudentSchema');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// Middleware to parse the request body


app.set('view engine', 'ejs');
app.set('views', './views');


// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://j_hamad83:afpc1967@franks.wmjjvee.mongodb.net/?retryWrites=true&w=majority&appName=Franks')
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Error connecting to the database:", err);
  });






  app.post('/adduser', (req, res) => {
    const student1 = new Student({
      fname: req.body.fname,
      lname: req.body.lname,
      age: req.body.age,
      address: req.body.address
    });
  
    student1.save()
      .then(() => {
        res.render('adduser', { done: 'User has been successfully added' });
        console.log("post setup");
        console.log("setup successfully saved");
      })
      .catch((error) => {
        res.status(500).send('Error adding student: ' + error);
      });
  });


// تشغيل الخادم
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


app.get('/home', (req, res) => { 
var data="";
  Student.find().then((student) => {  res.render('home', { students: student }); }).catch((error) =>{  console.log(error); res.status(500).send});

  console.log("get setup");
});




app.get('/adduser', (req, res) => {
  res.render('adduser', {});
  console.log("get adduser");
});


app.get('/showuser/:id', (req, res) => {
Student.findById(req.params.id).then((student) => {  res.render('user', {student:student}); }).catch((error) =>{  console.log(error); res.status(500).send});


});

app.get('/edituser/:id', (req, res) => {

  Student.findById(req.params.id)
    .then((student) => {
      console.log("edit user done");
      res.render('edit', { student: student });
    })
    .catch((error) => {
      console.log("edit user error");
      console.log(error);
      res.status(500).send('Error finding student');
    });
});


app.delete('/deleteuser/:id', (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then(() => {
      console.log("User deleted successfully kkkkkkkkkkkkkkk");
      res.redirect('/home'); // إعادة التوجيه إلى صفحة قائمة المستخدمين بعد الحذف
    })
    .catch((error) => {
      console.log("Error deleting user: ", error);
      res.status(500).send('Error deleting user');
    });
});


app.put('/updateuser/:id', (req, res) => {
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
});

app.post('/search', (req, res) => {
  const name = req.body.name; // Assuming the search name is sent in the request body

  Student.find({ $or: [{ fname: name }, { lname: name }] })
      .then(students => {
          res.render('home', { students: students });
      })
      .catch(error => {
          console.log(error);
          res.status(500).send("Internal Server Error");
      });
});

