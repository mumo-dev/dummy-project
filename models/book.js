module.exports = function (sequelize, DataTypes) {
    return sequelize.define("books", {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        downloadUrl: DataTypes.STRING
    });

};