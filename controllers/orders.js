const User = require('../sequelize').User;
const Area = require('../sequelize').Area;
const Town = require('../sequelize').Town;
const Menu = require('../sequelize').Menu;
const Restaurant = require('../sequelize').Restaurant;
const Order = require('../sequelize').Order;
const OrderItems = require('../sequelize').OrderItems;


const moment = require('moment');
const PushNotifications = require('pusher-push-notifications-node');

module.exports = {

    index(req, res) {

        Order.findAll({
            include: [{
                model: OrderItems,
                include: [{
                    model: Menu,
                    include: [{
                        model: Restaurant
                    }]
                }]
            },
                User,
                {
                    model: Area,
                    include: Town
                }],
            order: [['id', 'DESC']]
        }).then(orders => {
            const pOrders = [];
            orders.forEach(function (order) {
                const pOrder = {};
                pOrder['id'] = order.id;
                pOrder['status'] = order.status;
                pOrder['deliveryCost'] = order.deliveryCost;
                pOrder['createdAt'] = moment(order.createdAt).format('MMM Do YYYY, h:mm:ss')

                pOrder['userId'] = order.userId;
                pOrder['userName'] = order.user.name;
                pOrder['userEmail'] = order.user.email;
                pOrder['userPhone'] = order.user.phone;
                pOrder['userEmail'] = order.user.email;
                pOrder['town'] = order.area.town.name;
                pOrder['area'] = order.area.name;
                pOrder['orderItems'] = [];

                let totalCost = 0;
                order.order_items.forEach(function (item) {

                    const orderItems = {};

                    orderItems['id'] = item.id;
                    orderItems['price'] = item.price;
                    orderItems['quantity'] = item.quantity;
                    orderItems['createdAt'] = moment(item.createdAt).format('MMM Do YYYY, h:mm:ss')
                    orderItems['orderId'] = item.orderId;
                    orderItems['menuId'] = item.menuId;
                    orderItems['menuName'] = item.menu.name;
                    orderItems['subTotal'] = item.price * item.quantity;
                    pOrder['restaurant'] = item.menu.restaurant.name;
                    totalCost += orderItems['subTotal'];
                    pOrder.orderItems.push(orderItems);
                });

                pOrder["totalCost"] = totalCost;
                pOrder["cost"] = totalCost + order.deliveryCost;
                pOrders.push(pOrder);

            });
            res.render('admin/orders', {
                orders: pOrders,
                success: req.flash("successMessage"),
                error: req.flash('errorMessage')
            })
        }).catch(err => {
            res.render('admin/orders', {
                error: err
            })
        })
    },


    findOrderUsingIndex(req, res) {
        const index = req.params.id;
        Order.findById(index, {
            include: [{
                model: OrderItems,
                include: [{
                    model: Menu,
                    include: [{
                        model: Restaurant
                    }]
                }]
            },
                User,
                {
                    model: Area,
                    include: Town
                }]
        }).then(order => {
            const pOrder = {};
            pOrder['id'] = order.id;
            pOrder['status'] = order.status;
            pOrder['deliveryCost'] = order.deliveryCost;
            pOrder['createdAt'] = order.createdAt;

            pOrder['userId'] = order.userId;
            pOrder['userName'] = order.user.name;
            pOrder['userEmail'] = order.user.email;
            pOrder['userPhone'] = order.user.phone;
            pOrder['userEmail'] = order.user.email;
            pOrder['town'] = order.area.town.name;
            pOrder['area'] = order.area.name;
            pOrder['orderItems'] = [];

            let totalCost = 0;
            order.order_items.forEach(function (item) {

                const orderItems = {};

                orderItems['id'] = item.id;
                orderItems['price'] = item.price;
                orderItems['quantity'] = item.quantity;
                orderItems['createdAt'] = item.createdAt;
                orderItems['orderId'] = item.orderId;
                orderItems['menuId'] = item.menuId;
                orderItems['menuName'] = item.menu.name;
                orderItems['subTotal'] = item.price * item.quantity;
                pOrder['restaurant'] = item.menu.restaurant.name;
                totalCost += orderItems['subTotal'];
                pOrder.orderItems.push(orderItems);
            });

            pOrder["totalCost"] = totalCost;
            pOrder["cost"] = totalCost + order.deliveryCost;

            res.render('admin/order_details', {
                order: pOrder,
                success: req.flash("successMessage"),
                error: req.flash('errorMessage')
            })
        }).catch(err => {
            res.render('admin/order_details', {
                error: err
            })
        })
    },

    updateOrderStatus(req, res) {
        const values = {
            status: req.body.status
        };

        const selector = {
            where: {id: req.body.orderId}
        };

        Order.update(values, selector)
            .then(() => {

                let pushNotifications = new PushNotifications({
                    instanceId: 'f00f783a-c8e8-415b-89d7-83f906a2b258',
                    secretKey: '3E931B71E19577771396295A186F0687D0E270FC1A6954CFCD4ECA06349EAC89'
                });

                const notificationMsg = 'Your Order #' + order.id + ' has been ' + order.status;
                const channel = 'orderstatus' + order.userId;
                pushNotifications.publish(
                    [channel],
                    {
                        fcm: {
                            notification: {
                                title: 'Order Status',
                                body: notificationMsg
                            }
                        }

                    }).then((publishResponse) => {
                    console.log('Just published:', publishResponse.publishId);
                }).catch((error) => {
                    console.log('Error:', error);
                });


                /*req.io.emit('orderstatus' + order.userId,
                    'Your Order #' + order.id + ' has been ' + order.status
                );*/
                req.flash('successMessage', 'Order Status updated Successfully');
                res.redirect('/orders/' + req.body.orderId);
            })

    }

}
