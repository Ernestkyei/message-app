const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config({ path: '../config/config.env' });

const seedAdmins = async () => {
    try {
        //Using MONGO_URL to match your database config
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB\n');
        console.log('SEEDING ADMIN ACCOUNTS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━\n');

        const admins = [
            {
                name: 'Sarah Johnson',
                email: 'sarah@messageapp.com',
                password: 'Sarah123!',
                role: 'admin'
            },
            {
                name: 'Michael Chen',
                email: 'michael@messageapp.com',
                password: 'Michael123!',
                role: 'admin'
            },
            {
                name: 'Emma Williams',
                email: 'emma@messageapp.com',
                password: 'Emma123!',
                role: 'admin'
            },
            {
                name: 'David Kim',
                email: 'david@messageapp.com',
                password: 'David123!',
                role: 'admin'
            }
        ];

        let created = 0;
        let skipped = 0;

        for (const adminData of admins) {
            const existing = await User.findOne({ email: adminData.email });
            
            if (existing) {
                console.log(`${adminData.email} already exists`);
                skipped++;
                continue;
            }

            const admin = await User.create(adminData);
            console.log(`Created: ${admin.name} (${admin.email})`);
            created++;
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('SEED SUMMARY:');
        console.log(`Created: ${created} admin(s)`);
        console.log(`Skipped: ${skipped} existing`);

        const allAdmins = await User.find({ role: 'admin' }).select('-password');
        console.log('\nCURRENT ADMINS:');
        console.log('━━━━━━━━━━━━━━━━━━');
        allAdmins.forEach((admin, i) => {
            console.log(`${i + 1}. ${admin.name} - ${admin.email}`);
        });

    } catch (error) {
        console.error('Error seeding admins:', error.message);

    } finally {
    await mongoose.disconnect();
    console.log('Script completed successfully');
    process.exit(0);
}
};

seedAdmins();