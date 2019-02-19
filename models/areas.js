module.exports = function (sequelize, DataTypes) {
    const area = sequelize.define("areas", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name: DataTypes.STRING
    });

    return area;

};