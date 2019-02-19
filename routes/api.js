var express = require('express');
var menuController = require('../controllers/api/menu');
var blogController = require('../controllers/api/blog');
var orderController = require('../controllers/api/order');
var checkAuth = require('../middleware/check_auth');
var router = express.Router();

/*router.get('/menus', menuController.findAllMenus);
router.get('/menus/location/:town_id', menuController.findAllMenusInTown);
router.get('/menus/:id', menuController.findMenuById);*/

router.get('/towns', menuController.findTowns);
router.get('/towns/areas/:id', menuController.findAreasInTown);
router.get('/area/:id/restaurants', menuController.findRestaurantsInArea);
router.get('/restaurants/:id/menus', menuController.findRestaurantMenus);

router.post('/orders',checkAuth,orderController.saveOrder);
router.get('/orders',orderController.findAllOrders);
router.get('/orders/:id', checkAuth,orderController.findOrderById);
router.get('/orders/users/:id', checkAuth, orderController.findOrderByUser);

router.get('/blog',blogController.fetchAll);
router.get('/books',blogController.fetchAllBooks);
router.get('/blog/:id',blogController.fetchById);





module.exports = router;