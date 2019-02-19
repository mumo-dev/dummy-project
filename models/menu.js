module.exports = function (sequelize, DataTypes) {

    return sequelize.define("menus", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price:DataTypes.INTEGER
    });

};