const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');


const User = require('../sequelize').Admin;

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id).then(user => {
            if (user)
                done(null, user.get());
            else
                done(user.errors, null)


        })
    });


    passport.use('local-signup', new LocalStrategy(
        {

            usernameField: 'email',

            passwordField: 'password',

            passReqToCallback: true // allows us to pass back the entire request to the callback

        },


        function (req, email, password, done) {

            var generateHash = function (password) {

                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

            };


            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {

                if (user) {

                    return done(null, false, req.flash('signupMessage', 'Email is already taken'));

                } else {

                    var userPassword = generateHash(password);

                    var data = {
                        email: email,

                        password: userPassword

                    };

                    User.create(data).then(function (newUser, created) {

                        if (!newUser) {

                            return done(null, false);

                        }

                        if (newUser) {

                            return done(null, newUser);

                        }

                    });

                }

            });

        }
    ));
    /*
        passport.use(
            'local-signup',
            new LocalStrategy(
                {
                    // by default, local strategy uses username and password, we will override with email
                    userNameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },

                function (req, email, password, done) {
                    // find a user whose email is the same as the forms email
                    // we are checking to see if the user trying to login already exists

                    User.findOne({
                        where: {email: email}
                    }).then(user => {
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'Email is already taken'));
                        } else {
                            //if no user with that email, we create
                            User.create({
                                email: email,
                                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                            }).then(user => {
                                console.log(user)
                                if (user)
                                    return done(null, user);
                                else
                                    return done(null, false);
                            })
                        }
                    }).catch(err => {
                        done(err)
                    });
                }

                )
        );



    passport.use(
        'local-login',
        new LocalStrategy({
                userNameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, email, password, done) {

                var isValidPassword = function (userpass, password) {
                    return bcrypt.compareSync(password, userpass);
                };

                User.findOne({where: {email: email}})
                    .then(user => {
                        if (!user) {
                            return done(null, false, req.flash('loginMessage', 'Incorrect credentials !!'))
                        }
                        //if the user if found but password is wrong
                        if (!isValidPassword(user.password, password)) {
                            return done(null, false, req.flash('loginMessage', 'Incorrect credentials !!'))
                        }
                        // all is well, return successful user
                        return done(null, user.get());
                    })
                    .catch(err => {
                        return done(null, false, req.flash('loginMessage', 'Somethng went wrong when loggin in'));
                    })
            })
    );
    */

    passport.use('local-signin', new LocalStrategy(

        {

            // by default, local strategy uses username and password, we will override with email

            usernameField: 'email',

            passwordField: 'password',

            passReqToCallback: true // allows us to pass back the entire request to the callback

        },


        function(req, email, password, done) {


            var isValidPassword = function(userpass, password) {

                return bcrypt.compareSync(password, userpass);

            }

            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (!user) {

                    return done(null, false, req.flash('loginMessage', 'Incorrect email'));

                }

                if (!isValidPassword(user.password, password)) {

                    return done(null, false, req.flash('loginMessage', 'Incorrect password'));

                }


                var userinfo = user.get();
                return done(null, userinfo);


            }).catch(function(err) {

                console.log("Error:", err);

                return done(null, false, req.flash('loginMessage', 'Sorry, something went terribly wrong during login'));

            });


        }

    ));


};
