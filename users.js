const express= require('express');

const router= express.Router();

const passport= require('passport');

const userController= require('../controllers/user_controller');

router.get('/',userController.default);
router.get('/profile/:id', passport.checkAuthentication ,userController.profile);
router.get('/like',userController.like);
router.get('/sign_in',passport.checkSignedin ,userController.signin);
router.get('/sign_up',userController.sign_up);
router.post('/create',userController.create);
router.post('/create-post',userController.post);
router.post('/update/:id',userController.update);

//use passport as a middleware
router.post('/create-session',passport.authenticate(
    'local',
    { 
        failureRedirect:'/user/sign_in'},
),userController.createSession );

module.exports=router;

router.get('/sign_out',userController.endSession);