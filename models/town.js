module.exports = function (sequelize, DataTypes) {
    return sequelize.define("towns", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name: DataTypes.STRING
    });

};