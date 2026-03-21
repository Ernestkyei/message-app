const mongoose = require('mongoose');



const messageSchema = mongoose.Schema({

    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },

    content:{
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
        maxlength: [100, 'Message cannot be more than 100 characters']
    },

    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,



});

module.exports = mongoose.model('Message', messageSchema);