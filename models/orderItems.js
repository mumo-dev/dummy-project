module.exports = function (sequelize, DataTypes) {
    return sequelize.define("order_items", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        price: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER
    });


};