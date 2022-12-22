const mongoose = require('mongoose');

//connecting it
mongoose.connect('mongodb://localhost:27017/codeial_development');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connection to codieal database succesful!!');
});

module.exports=db;