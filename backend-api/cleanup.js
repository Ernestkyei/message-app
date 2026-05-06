// cleanup.js
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        const Conversation = require('./models/conversationModel');
        
        // 1. Delete conversations with null participants
        const result1 = await Conversation.deleteMany({ participants: null });
        console.log(`📋 Deleted ${result1.deletedCount} conversations with null participants`);
        
        // 2. Remove null values from participants array
        const result2 = await Conversation.updateMany(
            { participants: { $in: [null] } },
            { $pull: { participants: null } }
        );
        console.log(`📋 Updated ${result2.modifiedCount} conversations (removed nulls from arrays)`);
        
        // 3. Delete conversations with empty participants array
        const result3 = await Conversation.deleteMany({ participants: { $size: 0 } });
        console.log(`📋 Deleted ${result3.deletedCount} conversations with empty participants`);
        
        // 4. Show remaining conversations
        const remaining = await Conversation.find().countDocuments();
        console.log(`📋 Remaining conversations: ${remaining}`);
        
        console.log('✅ Cleanup complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

cleanup();