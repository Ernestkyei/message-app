const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const app = require('./app');
const connectDb = require('./config/db');

connectDb();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`Health check: Backend Api is running`);
});