const express = require('express');
const request = require('request');
const connectDB = require('./config/db');


const app = express();

//connect database
connectDB();
//CORS block  formdata,thats why all these configuration are needed
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header("Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // if (req.method === 'OPTIONS') {
    //     res.header('Access-Control-Allow-Origin', 'POST');
    //     return res.status(200).json({});
    // }

    next();
});



//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => { res.send('Ápi Running') });
//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('/', (req, res) => {
    res.send("API is running")
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));