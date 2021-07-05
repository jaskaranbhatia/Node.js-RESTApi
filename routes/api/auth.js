const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../setup/MyURL');

router.get('/',(req,res)=>{
    res.json({
        test: "Auth is being tested"
    })
});

//Import Schema for person to register
const Person = require('../../models/Person');

//POST request for registration
router.post('/register',(req,res)=>{
    Person.findOne({
        email:req.body.email
    })
    .then(person =>{
        if(person){
            return res.status(400).json({emailerror:'Email is already registered on our system'});
        }
        else{
            const newPerson = new Person({
                name : req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            //Encryt Password using bcrypt
            bcrypt.genSalt(10,(err, salt)=>{
             bcrypt.hash(newPerson.password, salt, function(err, hash) {
                    if(err) throw err;
                    newPerson.password = hash;
                    newPerson.save()
                    .then(person = res.json(person))
                    .catch(err=>console.log(err))
                });
            });
        }
    })
    .catch(err=>console.log(err));
});

//POST request for login
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    Person.findOne({email})
        .then(person =>{
            if(!person){
                return res.status(404).json({
                    emailerror:'User not found'
                });
            }
            bcrypt.compare(password,person.password)
            .then(isCorrect=>{
                if(isCorrect){
                        //use payload and create token for user
                        const payload = {
                            id:person.id,
                            name:person.name,
                            email:person.email
                        };
                    jsonwt.sign(
                        payload,
                        key.secret,
                        {expiresIn: 3600},
                        (err,token) => {
                            res.json({
                                success:true,
                                token: token
                            });
                        }
                    )
                }
                else{
                    res.status(400).json({passworderror:'Password not correct'});
                }
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
});


//GET Route for user profile @api/auth/profile PRIVATE

router.get('/profile',passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email,
        profilepic: req.user.profilepic
    })
});

module.exports = router;
