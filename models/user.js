module.exports = function (sequelize, DataTypes) {
    return sequelize.define("users", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        email: DataTypes.STRING,
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING
    });

};