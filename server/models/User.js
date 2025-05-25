const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function(v) {
        return passwordRegex.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: {
    type: String,
    enum: ['parent', 'student', 'admin'],
    default: 'parent'
  },
  children: [{
    name: {
      type: String,
      required: [true, 'Child name is required'],
      trim: true,
      minlength: [2, 'Child name must be at least 2 characters long']
    },
    age: {
      type: Number,
      required: [true, 'Child age is required'],
      min: [1, 'Age must be at least 1'],
      max: [18, 'Age cannot exceed 18']
    },
    grade: {
      type: String,
      required: [true, 'Child grade is required'],
      trim: true
    }
  }],
  grade: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  age: {
    type: Number,
    required: function() {
      return this.role === 'student';
    },
    min: [1, 'Age must be at least 1'],
    max: [18, 'Age cannot exceed 18']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.role === 'student';
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

// Method to generate email verification token
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Method to create default admin account
userSchema.statics.createDefaultParent = async function() {
  try {
    const defaultAdmin = await this.findOne({ email: 'admin@admin.com' });
    
    if (!defaultAdmin) {
      console.log('Creating default admin account...');
      const newAdmin = new this({
        name: 'Admin User',
        email: 'admin@admin.com',
        password: 'Admin123!',
        role: 'admin',
        isEmailVerified: true,
        children: []
      });
      
      await newAdmin.save();
      console.log('Default admin account created successfully');
    } else {
      console.log('Default admin account already exists');
    }
  } catch (error) {
    console.error('Error creating default admin account:', error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 