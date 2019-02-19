const User = require('../../sequelize').User;
const Area = require('../../sequelize').Area;
const Town = require('../../sequelize').Town;
const Menu = require('../../sequelize').Menu;
const Restaurant = require('../../sequelize').Restaurant;
const Order = require('../../sequelize').Order;
const OrderItems = require('../../sequelize').OrderItems;
const sequelize = require('sequelize');

const moment = require('moment');


module.exports = {

    saveOrder(req, res) {
        let orderItems = req.body.items;
        Order.create({
            userId: req.body.userId,
            status: 'placed',
            areaId: req.body.areaId,
            deliveryCost: req.body.cost
        }).then(order => {

            orderItems.forEach(function (item) {
                item['orderId'] = order.id
            });
            console.log(orderItems);
            OrderItems.bulkCreate(orderItems)
                .then(itemsOrdered => {

                    req.io.emit('neworder', 1);
                    const data = {
                        id:order.id,
                        message: 'Order Placed successfully',
                        items: itemsOrdered
                    };
                    console.log(data);
                    return res.status(200).json(data)
                })
                .catch(err => {
                    return res.status(500).json({
                        error: err,
                        message: 'Oops!, something went wrong.'
                    })
                })


        }).catch(err => {
            return res.status(500).json({
                error: err,
                message: 'Oops!, something went wrong.'
            })
        })

    },

    findAllOrders(req, res) {
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

                order.order_items.forEach(function (item) {

                    const orderItems = {};
                    orderItems['id'] = item.id;
                    orderItems['price'] = item.price;
                    orderItems['quantity'] = item.quantity;
                    orderItems['createdAt'] = moment(item.createdAt).format('MMM Do YYYY, h:mm:ss');
                    orderItems['orderId'] = item.orderId;
                    orderItems['menuId'] = item.menuId;
                    orderItems['menuName'] = item.menu.name;

                    pOrder['restaurant'] = item.menu.restaurant.name;

                    pOrder.orderItems.push(orderItems);
                });

                pOrders.push(pOrder);

            });
            return res.status(200).json(pOrders)
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })
    },

    findOrderById(req, res) {
        Order.findById(req.params.id, {
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
            pOrder['createdAt'] = moment(order.createdAt).format('MMM Do YYYY, h:mm:ss');
            pOrder['userId'] = order.userId;
            pOrder['userName'] =  order.user.name;
            pOrder['userEmail'] = order.user.email;
            pOrder['userPhone'] = order.user.phone;
            pOrder['userEmail'] = order.user.email;
            pOrder['town'] = order.area.town.name;
            pOrder['area'] = order.area.name;
            pOrder['orderItems'] = [];

            order.order_items.forEach(function (item) {

                const orderItems = {};
                orderItems['id'] = item.id;
                orderItems['price'] = item.price;
                orderItems['quantity'] = item.quantity;
                orderItems['createdAt'] = moment(item.createdAt).format('MMM Do YYYY, h:mm:ss');
                orderItems['orderId'] = item.orderId;
                orderItems['menuId'] = item.menuId;
                orderItems['menuName'] = item.menu.name;

                pOrder['restaurant'] = item.menu.restaurant.name;

                pOrder.orderItems.push(orderItems);
            });
            return res.status(200).json(pOrder)
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })
    },

    findOrderByUser(req, res) {
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
            where: {
                userId: req.params.id
            },
            order: [['id', 'DESC']]
        }).then(orders => {
            const pOrders = [];
            orders.forEach(function (order) {
                const pOrder = {};
                pOrder['id'] = order.id;
                pOrder['status'] = order.status;
                pOrder['deliveryCost'] = order.deliveryCost;
                pOrder['createdAt'] =moment(order.createdAt).format('MMM Do YYYY, h:mm:ss');
                pOrder['userId'] = order.userId;
                pOrder['userName'] = order.user.name;;
                pOrder['userEmail'] = order.user.email;
                pOrder['userPhone'] = order.user.phone;
                pOrder['userEmail'] = order.user.email;
                pOrder['town'] = order.area.town.name;
                pOrder['area'] = order.area.name;
                pOrder['orderItems'] = [];

                order.order_items.forEach(function (item) {

                    const orderItems = {};
                    orderItems['id'] = item.id;
                    orderItems['price'] = item.price;
                    orderItems['quantity'] = item.quantity;
                    orderItems['createdAt'] = moment(item.createdAt).format('MMM Do YYYY, h:mm:ss')
                    orderItems['orderId'] = item.orderId;
                    orderItems['menuId'] = item.menuId;
                    orderItems['menuName'] = item.menu.name;

                    pOrder['restaurant'] = item.menu.restaurant.name;

                    pOrder.orderItems.push(orderItems);
                });

                pOrders.push(pOrder);

            });
            return res.status(200).json(pOrders)
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })
    }

};