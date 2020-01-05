const mongoose = require('mongoose');

// const Profiles = require('../../modals/Profiles');
//const User = require('../../modals/User');


// const config = require('config');
//const db = config.get('mongoURI');

// mongoDB  locally connected and port 12345
var mongoDB = 'mongodb://127.0.0.1/developer_register';
// mongoose.model('user', UserSchema)



const connectDB = async () => {
    try {
        await mongoose.connect(mongoDB,

            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
        console.log('Mongodb Connected..');
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;