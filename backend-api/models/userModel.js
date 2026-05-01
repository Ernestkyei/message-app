const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    
    phone: {
        type: String,
        default: '',
        trim: true,
    },

    address: {
        type: String,
        default: '',
        trim: true,
    },

    bio: {
        type: String,
        default: '',
        maxlength: 500,
        trim: true,
    }

}, {
    timestamps: true,
});

// Hashing the password
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);