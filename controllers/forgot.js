const User = require('../sequelize').User;
const Admin = require('../sequelize').Admin;
const PasswordResets = require('../sequelize').PasswordReset;

const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports = {

    showforgetPassowrdView(req, res) {

        res.render('forgot-password', {
            title: 'Forgot Password',
            header: 'show'
        })
    },

    forgetPassword(req, res) {

        Admin.findOne({
            where: {
                email: req.body.email
            }
        }).then(admin => {
            if (admin) {
                const email = admin.email;
                const token = jwt.sign(
                    {
                        email: email,
                        id: admin.id
                    },
                    'secret',
                    {
                        expiresIn: '8760h' //after  a year
                    }
                );

                //save the token in db;;
                PasswordResets.create({
                    token: token,
                    email: email
                }).then(resets => {
                    //send email
                    /*
                    var smtpTransport = nodemailer.createTransport('SMTP', {
                        service: 'SendGrid',
                        auth: {
                            user: '!!! YOUR SENDGRID USERNAME !!!',
                            pass: '!!! YOUR SENDGRID PASSWORD !!!'
                        }
                    });
                    var mailOptions = {
                        to: user.email,
                        from: 'passwordreset@demo.com',
                        subject: 'Node.js Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');

                    });
                    */

                    return res.json({
                        message: 'Password reset link has been send to your email with further instructions'
                    })

                })

            } else {
                return res.json({
                    message: 'No account exists uses that email'
                })
            }
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })

    },

    showResetPasswordView(req, res) {
        const token = req.params.token;
        const id = req.query.id;

        res.render('reset-password', {token, id})

    }
    ,

    resetPassword(req, res) {

        const id = req.query.id;
        const token = req.body.token;
        const password = req.body.password;

        const generateHash = function (password) {

            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

        };

        PasswordResets.findOne({
            where: {token: token}
        }).then((result) => {
            if (result) {
                const email = result.email;
                if(id == 2){
                    User.findOne({
                        where: {email: email}
                    }).then((user) => {
                        if (user) {
                            const userPassword = generateHash(password);
                            user.update({password: userPassword}, {where: {id: user.id}})
                                .then(() => {
                                    return res.json({
                                        message: 'Password reset successful. Login in with your new password'
                                    })
                                }).catch(err => {

                                res.status(500).json({
                                    error: err
                                })
                            })
                        } else {
                            return res.json({
                                message: 'Password reset failed. Try resending another password reset link'
                            })
                        }
                    }).catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }else {
                    Admin.findOne({
                        where: {email: email}
                    }).then((admin) => {
                        if (admin) {
                            const userPassword = generateHash(password);
                            admin.update({password: userPassword}, {where: {id: admin.id}})
                                .then(() => {
                                    return res.json({
                                        message: 'Password reset successful. Login in with your new password',
                                        redirect:true
                                    })
                                })
                                .catch(err => {

                                res.status(500).json({
                                    error: err
                                })
                            })
                        } else {
                            return res.json({
                                message: 'Password reset failed. Try resending another password reset link'
                            })
                        }
                    }).catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }


            } else {
                return res.json({
                    message: 'Password reset failed. Try resending another password reset link'
                })
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
    },

    forgetUserPassword(req, res) {

        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                const email = user.email;
                const token = jwt.sign(
                    {
                        email: email,
                        id: user.id
                    },
                    'secret',
                    {
                        expiresIn: '8760h' //after  a year
                    }
                );

                //save the token in db;;
                PasswordResets.create({
                    token: token,
                    email: email
                }).then(resets => {
                    //send email
                    /*
                    var smtpTransport = nodemailer.createTransport('SMTP', {
                        service: 'SendGrid',
                        auth: {
                            user: '!!! YOUR SENDGRID USERNAME !!!',
                            pass: '!!! YOUR SENDGRID PASSWORD !!!'
                        }
                    });
                    const resetUrl = 'http://' + req.headers.host + '/reset/' + token +'?id=2';
                    var mailOptions = {
                        to: user.email,
                        from: 'passwordreset@demo.com',
                        subject: 'Node.js Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            resetUrl + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');

                    });
                    */

                    return res.status(200).json({
                        message: 'Password reset link has been send to your email with further instructions'
                    })

                })

            } else {
                return res.status(200).json({
                    message: 'No account exists uses that email'
                })
            }
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })

    },
}
;