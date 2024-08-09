const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,  // Ensure the username is unique
    trim: true,    // Trim whitespace around the username
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    // Store email in lowercase
    trim: true,       // Trim whitespace around the email
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],  // Basic email validation
  },
  password: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

// Pre-save hook to hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 10;  // Increased salt rounds for better security
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
