const express = require('express')
const app = express()
const port = 3000
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const Student = require('./models/StudentSchema');
const mongoose = require('mongoose');




// الاتصال بقاعدة البيانات
mongoose.connect('mongodb+srv://j_hamad83:afpc1967@franks.wmjjvee.mongodb.net/?retryWrites=true&w=majority&appName=Franks')
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Error connecting to the database:", err);
  });

// مسار GET بسيط
app.get('/h', (req, res) => {
  res.send('Hello World!');
});

// مسار لإرسال ملف HTML
app.get('/salman', (req, res) => {
  res.sendFile('./views/home.html', { root: __dirname });
});

// مسار POST لإضافة طالب جديد


app.post('/addstudent', (req, res) => {


  const student1 = new Student({
    fname: req.body.fname,
    lname: req.body.lname,
    age: req.body.age,
    address: req.body.address
  });

  student1.save()
    .then(() => {
    res.redirect("/setup");
    console.log("post setup");
    console.log("set up sucessfulz saved");
    })
    .catch((error) => {
      res.status(500).send('Error adding student:    ' + error);
    });
});


// تشغيل الخادم
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


app.get('/setup', (req, res) => { 
  res.sendFile('./views/home.html', { root: __dirname });
  console.log("get setup");
});
