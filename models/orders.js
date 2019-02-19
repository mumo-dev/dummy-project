module.exports = function (sequelize, DataTypes) {
    return  sequelize.define("orders", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        status: DataTypes.STRING,
        areaId: DataTypes.INTEGER,
        deliveryCost: DataTypes.INTEGER
    });



};