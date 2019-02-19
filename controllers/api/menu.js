const Restaurant = require('../../sequelize').Restaurant;
const Town = require('../../sequelize').Town;
const Menu = require('../../sequelize').Menu;
const Area = require('../../sequelize').Area;
const RestaurantLocations = require('../../sequelize').RestaurantLocations;


module.exports = {

    findTowns(req, res) {
        Town.findAll({
            order: [['name', 'ASC']]
        }).then(towns => {

            res.status(200).json(towns);

        }).catch(err => {
            res.status(500).json({error: 'Oops!!, Something went wrong'})
        })

    },

    findAreasInTown(req, res){
        Area.findAll({
            where:{
                townId: req.params.id
            },
            order: [['name', 'ASC']]
        }).then(areas =>{
            res.status(200).json(areas);

        }).catch(err => {
            res.status(500).json({error: err, message: 'Oops!!, Something went wrong'})
        })
    },

    findRestaurantsInArea(req, res){
        RestaurantLocations.findAll({
            where:{ areaId: req.params.id},
            include:[ Restaurant]
        }).then(locs =>{
            res.status(200).json(locs);

        }).catch(err => {
            res.status(500).json({error: err, message: 'Oops!!, Something went wrong'})
        })
    },
    findRestaurantMenus(req, res){
        Menu.findAll({
            where:{restaurantId: req.params.id}
        }).then(menus =>{
            res.status(200).json(menus);

        }).catch(err => {
            res.status(500).json({error: err, message: 'Oops!!, Something went wrong'})
        })
    }




};