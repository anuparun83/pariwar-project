const User = require('../models/user');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const { listenerCount } = require('../models/user');


exports.getLogin = (req, res, next) => {
    let error='';
    res.render('auth/login.ejs',{error:7})
}

exports.getSignup = (req, res, next) => {
    let error='';
    res.render('auth/signup.ejs',{error:error})
}

exports.getForgetPage = (req, res, next) => {
    let error='';
    res.render('auth/forgetPassword.ejs',{error:error})
}

// exports.getChangePass = (req,res,next) => {
//     let user_name = '';
//     if (req.user) user_name = req.user.name;
//     res.render('auth/changePass',{
//         user_name:user_name,
//         email:req.user.email
//     });
// }

// exports.postSingnup =async (req,res,next)=>{
//     const { fullName, mobileNo, email, password, confirmPassword ,gender } = req.body;
//    console.log(email);
//    console.log(mobileNo);
//     const userInfo = {
//         fullName: fullName,
//         mobileNo: mobileNo,
//         email: email,
//         password: password,
//         gender:gender,
//         confirmPassword: confirmPassword
//     };
//     try {
//         // Check if the email already exists in the database
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//           return res.status(409).json({ error: 'Email address is already registered' });
//         }
    
//         // If the email doesn't exist, create a new user
//         const newUser = new User({ fullName, email, password:bcrypt.hash(password, 15),gender,mobileNo });
//         await newUser.save();
    
//         res.status(201).json({ message: 'User created successfully' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while creating the user' });
//       }
// }
exports.postSingnup = (req, res, next) => {
    const { fullName, mobileNo, email, password, confirmPassword ,gender } = req.body;
   let error='';
    const userInfo = {
        fullName: fullName,
        mobileNo: mobileNo,
        email: email,
        password: password,
        gender:gender,
        confirmPassword: confirmPassword
    };

    //validating fullName
    if (!fullName || fullName.trim() === '') {
        console.log('fullName cannot be blank');
        res.render('auth/signup', {
          formData: userInfo,
          error: 0
        });
        return;
      }

    // validating Mobile Number
    if (mobileNo.trim().length !== 10) {
        console.log('mobileNo is Invalid');
        res.render('auth/signup', {
            formData: userInfo,
            error: 2
        })
        return;
    }

    //validating email
    if (!validator.validate(email)) {
        console.log('email is not correct');
        // res.redirect('/signup');
        res.render('auth/signup', {
            formData: userInfo,
            error: 1
        })
        return;
    }

    if (password.length <= 5) {
        console.log('Password is to short');
        res.render('auth/signup', {
            formData: userInfo,
            error: 3
        })
        return;
    }

    // validating password
    if (password !== confirmPassword) {
        console.log('password are not matching');
        // res.redirect('/signup');
        res.render('auth/signup', {
            formData: userInfo,
            error: 4
        })
        return;
    }

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return null;
            }
            else {
                return bcrypt.hash(password, 10);
            }

        })
        .then(hashPassword => {
            if (!hashPassword) {
                // console.log('userExist');
                return null;
            }
            else {
                const user = new User({
                    name: fullName,
                    phoneNo: mobileNo,
                    email: email,
                    password: hashPassword
                })

                return user.save();
            }
        })
        .then(result => {
            if (!result) {
                console.log('user already exist');
                res.render('auth/signup', {
                    formData: userInfo,
                    error: 'emailExist'
                })
                return;
            }
            else { let msg ='',ca;
                res.render('success',{msg:101});
            }
        })
        .catch(err => {
            console.log(err);
        })
   
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    let currUser;
     let error ='';
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
               
                res.render('auth/login', {
                    email: email,
                  
                    error: 0
                })
                return null;
            }
            else {
                currUser = user;
                return bcrypt.compare(password, user.password);
            }
        })
        .then(compareResult => {
            if (!compareResult) {
                console.log('login failed');
                // res.redirect('/');
                res.render('auth/login', {
                    email: email,
                    password: password,
                    error: 1
                })
            }
            else {
                console.log('login successfully');
                req.session.isLoggedIn = true;
                req.session.user = currUser;
                if (email === 'abc123@gmail.com') {
                    console.log('admon ghusa ');
                    req.session.admin = true;
                }
                    
                req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postForgetPass =(req,res)=>{
    const { email } = req.body;
    let error ='';
    if (!validator.validate(email)) {
        
        // res.redirect('/signup');
        console.log("emailis not correct");
        res.render('auth/forgetPassword', {
            
            error: 1
        })
        return;
    }
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            console.log("email is not registered");
            res.render('auth/forgetPassword', {
                
                error: 2
            })
        }
        else{
            console.log('oTp sent successfully');
            res.render('auth/otp')
        }
    }).catch(err=>{
        console.log(err)
    });
}

exports.postLogout = (req, res, next) => {

    
//     const token = req.body._csrf;
//   if (!token || token !== req.csrfToken()) {
//     // Invalid CSRF token, handle accordingly
//     res.sendStatus(403);
//     return;
//   }
 let msg ='';
   console.log(req.session.user)
    req.session.destroy(err => {
        console.log(req.session);
        let lo;
        res.render('success',{msg:100});
    })
}
