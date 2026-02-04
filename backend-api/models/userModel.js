const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');


const userSchema =  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase:true,
        trim:true,
    },

    password: {
        type:String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false,
    },

    role:{
        type:String,
        enum: ['user', 'admin'],
        default: 'user',

    }


},{
    timestamps:true, //createdAt & updatedAt
}

)

//hashing the password
userSchema.pre('save', async function(){
    if(!this.isModified('password'))
        return;

    this.password = await bycrypt.hash(this.password,10);
    
});

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bycrypt.compare(enteredPassword, this.password)
};

module.exports = mongoose.model('User', userSchema);
