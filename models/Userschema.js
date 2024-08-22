const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true, 
    trim: true,
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,   // Convert email to lowercase before saving
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 8, // Ensure password has a minimum length
    match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}$/, 'Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character'],
  },
  customerinfo:[{
    fname: String,
    lname: String,
    age: String,
    address: String,
  }],
  profileImage: { type: Schema.Types.String },
}, 

{ timestamps: true });

// Pre-save hook to hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
  if (this.isModified('password') || this.isNew) {

    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
