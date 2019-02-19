module.exports = function (sequelize, DataTypes) {
    return sequelize.define("admins", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        email: DataTypes.STRING,
        password: DataTypes.STRING
    });

};