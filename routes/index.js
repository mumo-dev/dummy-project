var express = require('express');
var passport = require('passport');
var sharp = require('sharp');
const { Op } = require('sequelize')

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, 'public/files/books/')
        } else {
            cb(null, 'public/images/')
        }
    },
    filename: function (req, file, cb) {
        /* sharp().resize(200, 200).toFile(newPath, function(err) {
             if (err) {
                 throw err;
             }
         });*/
        if (req.body.resImageUrl) {
            cb(null, req.body.resImageUrl);
            return;
        }
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage
});


var adminController = require('../controllers/admin');
var restaurantController = require('../controllers/restaurant');
var ordersController = require('../controllers/orders');
var blogController = require('../controllers/blog');
var forgetController = require('../controllers/forgot');
var bookController = require('../controllers/book');
var Order = require('../sequelize').Order;
var User = require('../sequelize').User;
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Home'});
});

router.get('/login', (function (req, res) {
    res.render('login', {message: req.flash('loginMessage')});
}));

router.get('/forgot-password', forgetController.showforgetPassowrdView);
router.post('/forgot-password', forgetController.forgetPassword);
router.post('/api/forgot-password', forgetController.forgetUserPassword);
router.get('/reset/:token', forgetController.showResetPasswordView);
router.post('/reset-password', forgetController.resetPassword);

router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    // if (req.body.remember) {
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;// 24 hours
    // }
    res.redirect('/');
});

router.get('/signup', function (req, res) {
    res.render('signup', {message: req.flash('signupMessage')});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup',
    failureFlash: true
}), function (req, res) {
    console.log(req.body)
});

router.get('/dashboard', isLoggedIn, function (req, res) {
    res.render('dashboard', {
        user: req.user
    });

});

/* TODO add isLoggedIn middleware */
router.get('/locations', isLoggedIn, adminController.getLocation);
router.post('/addTown', isLoggedIn, adminController.addTown);
router.post('/updateTown', isLoggedIn, adminController.updateTown);
router.post('/deleteTown', isLoggedIn, adminController.deleteTown);

router.get('/locations/:id', isLoggedIn, adminController.getLocationEstatesById);
router.post('/addArea',isLoggedIn, adminController.addArea);
router.post('/updateArea', isLoggedIn,adminController.updateArea);
router.post('/deleteArea', isLoggedIn,adminController.deleteArea);

router.get('/restaurants',isLoggedIn, restaurantController.index);
router.get('/restaurants/:id', isLoggedIn,restaurantController.displayMenu);
router.post('/addRestaurant',isLoggedIn, upload.single('resImage'), restaurantController.add);
//TODO not updating image
router.post('/updateRestaurant',isLoggedIn, upload.single('resImage'), restaurantController.update);
router.post('/deleteRestaurant',isLoggedIn, restaurantController.delete);

router.post('/addMenu', isLoggedIn,restaurantController.addMenu);
router.post('/updateMenu',isLoggedIn, restaurantController.updateMenu);
router.post('/deleteMenu', isLoggedIn,restaurantController.deleteMenu);
router.get('/delivery-locations/:id',isLoggedIn, restaurantController.getDeliveryLocations);
router.post('/addDeliveryLocations', isLoggedIn, restaurantController.addDeliveryLocations);
router.post('/updateDeliveryLocations/',isLoggedIn, restaurantController.updateDeliveryLocations);
router.post('/deleteDelivery', isLoggedIn,restaurantController.deleteDeliveryLocation);

router.get('/orders', isLoggedIn, ordersController.index);
router.get('/orders/:id', isLoggedIn, ordersController.findOrderUsingIndex);
router.post('/updateOrderStatus',isLoggedIn, ordersController.updateOrderStatus);

router.get('/blog', isLoggedIn, blogController.index);
router.get('/blog/:id', isLoggedIn, blogController.showBlogItem);
router.get('/blog/edit/:id', isLoggedIn, blogController.edit);
router.get('/blog/delete/:id', isLoggedIn, blogController.delete);
router.get('/blog/create', isLoggedIn, blogController.showCreateView);
router.post('/blog', isLoggedIn, blogController.create);
router.post('/blog/update', isLoggedIn, blogController.update);

router.get('/books', isLoggedIn, bookController.index);
router.post('/books', isLoggedIn, upload.single('bookUrl'), bookController.create);
router.post('/deleteBook', isLoggedIn, bookController.delete);
router.post('/updateBooks',isLoggedIn, upload.single('bookUrl'), bookController.update);


router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/orders-count', (req, res)=>{
    Order.findAll({
        where: { status: 'placed'}
    }).then(orders=>{
        return res.status(200).json({
            count: orders.length
        })
    });
});

router.get('/orders-for-today', (req, res)=>{
    Order.findAll({
        where: {
            createdAt: {
                [Op.gt]:new Date() - 24 * 60 * 60 * 1000
            }
        }
    }).then(orders=>{
        return res.status(200).json({
            count: orders.length
        })
    });
});

router.get('/orders-this-week', (req, res)=>{
    Order.findAll({
        where: {
            createdAt: {
                [Op.gt]:new Date() - 24 * 7 * 60 * 60 * 1000
            }
        }
    }).then(orders=>{
        return res.status(200).json({
            count: orders.length
        })
    });
});

router.get('/total-active-customers', (req, res)=>{
    User.findAll().then((result) => {
        return res.status(200).json({
            count:result.length
        })
    }).catch((err) => {
        
    });
})


// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
