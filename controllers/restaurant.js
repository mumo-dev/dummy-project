const Restaurant = require('../sequelize').Restaurant;
const Town = require('../sequelize').Town;
const Area = require('../sequelize').Area;
const Menu = require('../sequelize').Menu;
const DeliveryLocations = require('../sequelize').RestaurantLocations;

module.exports = {

    index(req, res) {
        Restaurant.findAll().then((restaurants) => {
            res.render('admin/restaurants', {
                restaurants,
                success: req.flash('successMessage'),
                error: req.flash('errorMessage')
            });


        })


    },

    add(req, res) {
        //validate
        Restaurant.create({
            name: req.body.name,
            image_url: req.file.filename
        }).then(() => {
            req.flash('successMessage', 'Restaurant Added');
            res.redirect('/restaurants');
        }).catch(err => {
            req.flash('errorMessage', 'Oops!!, something happened');
            res.redirect('/restaurants');
        })
    },
    update(req, res) {
        //validate
        const values = {
            name: req.body.name
        };
        const selector = {
            where: {id: req.body.id}
        };

        Restaurant.update(values, selector)
            .then(() => {
                req.flash('successMessage', 'Restaurant updated');
                res.redirect('/restaurants');
            })
            .catch(err => {
                req.flash('errorMessage', 'Oops!!, something happened');
                res.redirect('/restaurants');
            })
    },

    delete(req, res) {

        Restaurant.findById(req.body.id)
            .then(restuarant => {
                if (restuarant) {
                    return restuarant.destroy()
                }
            })
            .then(() => {
                req.flash('successMessage', 'Restaurant deleted');
                res.redirect('/restaurants');
            })
            .catch((err) => {

                req.flash('errorMessage', 'Oops!!, something happened');
                res.redirect('/restaurants');
            })

    },

    displayMenu(req, res) {
        Restaurant.findById(req.params.id, {
            include: [
                {
                    model: Menu,
                    as: 'menus'
                }
            ]
        })
            .then(restaurant => {

                res.render('admin/menus', {
                    restaurant,
                    success: req.flash('successMessage'),
                    error: req.flash('errorMessage')
                });
            })
            .catch(err => {
                throw err;
            })

    },

    addMenu(req, res) {
        const restId = req.body.restaurantId;
        //validate
        console.log(req.file);
        Menu.create({
            name: req.body.menuName,
            description: req.body.menuDescription,
            price: req.body.menuPrice,
            restaurantId: restId,
            //
        }).then(() => {
            req.flash('successMessage', 'Menu added successfully');
            res.redirect('/restaurants/' + restId);
        }).catch(err => {
            req.flash('errorMessage', 'Oops!!, something happened');
            res.redirect('/restaurants/' + restId);
        })

    },
    updateMenu(req, res) {
        const values = {
            name: req.body.menuName,
            price: req.body.menuPrice,
            description: req.body.menuDescription
        };
        const selector = {
            where: {id: req.body.menuId}
        };

        Menu.update(values, selector)
            .then(() => {
                req.flash('successMessage', 'Menu updated');
                res.redirect('/restaurants/' + req.body.restaurantId);
            })
            .catch(err => {
                req.flash('errorMessage', 'Oops!!, something happened');
                res.redirect('/restaurants/' + req.body.restaurantId);
            })
    },

    deleteMenu(req, res) {
        //delete the imagePhoto
        //req.body.imageUrl contains the image name on server

        Menu.findById(req.body.id)
            .then(menu => {
                if (menu) {
                    return menu.destroy()
                }
            })
            .then(() => {
                req.flash('successMessage', 'Menu deleted');
                res.redirect('/restaurants/' + req.body.restaurantId);
            })
            .catch((err) => {
                req.flash('errorMessage', 'Oops!!, something happened');
                res.redirect('/restaurants/' + req.body.restaurantId);
            })

    },

    getDeliveryLocations(req, res) {
        const id = req.params.id;
        Town.findAll()
            .then(towns => {
                DeliveryLocations.findAll({
                    where: {
                        restaurantId: id
                    },
                    include: [Town, Area]
                }).then(locs => {
                    console.log(locs);
                    res.render('admin/locations-d', {
                        locations: locs,
                        towns,
                        id,
                        success: req.flash('successMessage'),
                        error: req.flash('errorMessage')
                    });
                })

            })

    },
    addDeliveryLocations(req, res) {
        const data = {
            time: req.body.time,
            fees: req.body.fee,
            areaId: req.body.areaId,
            townId: req.body.townId,
            restaurantId: req.body.resId
        };

        DeliveryLocations.create(data)
            .then(() => {
                req.flash('successMessage', 'Delivery Location added successfully');
                res.redirect('/delivery-locations/' + data.restaurantId);
            })
            .catch(err => {
                console.log(err);
                req.flash('errorMessage', 'Oops!!, something went wrong');
                res.redirect('/delivery-locations/' + data.restaurantId);
            })
    },
    updateDeliveryLocations(req, res) {
        const id = req.body.resId;
        const data = {
            time: req.body.delTime,
            fees: req.body.delFee
        };
        const selector = {
            where: {
                areaId: req.body.delAreaId,
                restaurantId: id
            }
        };

        DeliveryLocations.update(data, selector)
            .then(() => {
                req.flash('successMessage', 'Delivery Location updated successfully');
                res.redirect('/delivery-locations/' + id);
            })
            .catch(err => {
                console.log(err);
                req.flash('errorMessage', 'Oops!!, something went wrong');
                res.redirect('/delivery-locations/' + id);
            })
    },

    deleteDeliveryLocation(req, res) {
        const data = {
            restaurantId: req.body.restId,
            areaId: req.body.areaId
        };

        DeliveryLocations.findOne({
            where: {
                restaurantId: data.restaurantId,
                areaId: data.areaId
            }
        }).then(result => {
            if (result) {
                return result.destroy();
            }
        }).then(() => {
            req.flash('successMessage', 'Delivery Location deleted successfully');
            res.redirect('/delivery-locations/' + data.restaurantId);
        }).catch(err => {

            req.flash('errorMessage', 'Oops!!, something went wrong');
            res.redirect('/delivery-locations/' + data.restaurantId);
        })
    }

};