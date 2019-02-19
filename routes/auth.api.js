const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const User = require('../sequelize').User;

var router = express.Router();

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        var isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
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

            return res.status(200).json({
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                token: token
            })
        } else {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post('/register', (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const phone = req.body.phone;
    const areaId = req.body.areaId;
    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user) {
            return res.status(422).json({
                message: 'Email already exists'
            })
        } else {
            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            if (hashedPassword !== null) {
                User.create({
                    email: email,
                    password: hashedPassword,
                    phone: phone,
                    name: name,
                    areaId: areaId
                }).then(user => {
                    return res.status(201).json(user)
                }).catch(err => {
                    return res.status(500).json({error: err})
                })
            }
        }

    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


module.exports = router;