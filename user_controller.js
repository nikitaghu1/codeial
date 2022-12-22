const User= require('../models/user');
const Post= require('../models/post');
const fs= require('fs');
const path= require('path');



module.exports.profile= function(req,res){
    User.findById(req.params.id,function(err,users){
        if(err)
        {
            console.log('error in finding user for profile');
        }
        console.log(users);
        return res.render('profile',{
            title:'Profile',
            curr_user:users
    });
    });

}

module.exports.like= function(req,res){
    res.send('<h1>Like in users </h1>');
}

module.exports.default= function(req,res){
    res.send('<h1>Users biatchhh </h1>');
}

module.exports.signin= function(req,res){
    return res.render('sign_in',{
        title:'Sign-in'
});
}

module.exports.sign_up= function(req,res){
    return res.render('sign_up',{
        title:'Sign-up'
});
}

module.exports.create= function(req,res)
{
    if(req.body.password != req.body.confirm_password)
    {
        return res.redirect('back');
    }
    
    User.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            console.log('error in finding user');
            return;
        }

        if(!user)
        {
            User.create(req.body,function(err,user)
            {
                if(err)
                {
                    console.log('error in creating user');
                }

                return res.render('sign_in',{
                    title:'Sign-in'
            });
            })
        }
        else{
            res.redirect('back');
        }
    });
}
module.exports.createSession= function(req,res)
{
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

module.exports.endSession= function(req,res)
{
    req.logout();
    req.flash('success', 'Logged out successfully');
    return res.redirect('/');
}

module.exports.post= function(req,res)
{
    console.log(req.body);
    Post.create({
        content: req.body.post_data
    },
    function(err,post)
    {
        if(err)
        {
            req.flash('error',err);
        }
        req.flash('success','Post Published');
        return res.redirect('/');

    });
    
}

module.exports.update= async function(req,res)
{
    if(req.params.id== req.user.id)
    {
        try{

            let user= await User.findById(req.params.id);
 
            User.uploadedAvatar(req,res,function(err){
                if(err)
                {
                    console.log('error',err);
                }
                user.name= req.body.name;
                user.email= req.body.email;

                console.log(req.file);
    
                if(req.file)
                {
                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    user.avatar= User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return;
        }
        // User.findByIdAndUpdate(req.params.id, req.body,function(err,user)
        // {
        //     req.flash('success','User Updated');
        //     return res.redirect('back');
        // });
    }
    else{
        req.flash('error','Unauthorized');
        return res.status(401).send("Unauthorized");
    }
}