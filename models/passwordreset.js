module.exports = function (sequelize, DataTypes) {
    return sequelize.define("password-reset", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        token: DataTypes.STRING,
        email: DataTypes.STRING
    });

};