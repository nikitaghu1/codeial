const express= require('express');
const cookieParser= require('cookie-parser');
const app= express();
const port=8000;
const db= require('./config/mongoose');
const session= require('express-session');
const passport= require('passport');
const passportLocal= require('./config/passport-local-strategy');
const MongoStore= require('connect-mongo');
const sassMiddleware= require('node-sass-middleware');
const flash= require('connect-flash');
const customMware= require('./config/middleware');

app.use(sassMiddleware({
     src:'./assets/scss',
     dest:'./assets/css',
     debug:true,
     outputStyle:'extended',
    prefix:'/css'

}));

app.use(express.urlencoded());
app.use(cookieParser());

const expressLayout= require('express-ejs-layouts');
const { prefixStyle } = require('npmlog');
app.use(expressLayout);
app.use(express.static('./assets'));


app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name:'codeial',
    //TODO change secret before deployement
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/codeial_development',
        mongooseConnection: db,
        autoRemove: 'disabled',
    },
    function(err)
    {
        console.log(err || 'mongo errror');
    }
    )
}
));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));
app.use('/uploads', express.static(__dirname +'/uploads'));

app.listen(port,function(err)
{
    if(err)
    {
        console.log(`Error due to: ${err}`);
        return;
    }
    console.log(`Server running at port: ${port}`);
});

