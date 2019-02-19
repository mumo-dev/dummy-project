const  Sequelize = require('sequelize');

const AdminModel = require('./models/admin');
const UserModel = require('./models/user');
const TownModel = require('./models/town');
const AreaModel = require('./models/areas');
const RestaurantModel = require('./models/restaurant');
const MenuModel = require('./models/menu');
const OrderModel = require('./models/orders');
const OrderItemsModel = require('./models/orderItems');
const BlogModel = require('./models/blog');
const BookModel = require('./models/book');
const PasswordResetModel = require('./models/passwordreset');

const config = require('./config/database');

const sequelize = new Sequelize(config.database,config.connection.user, config.connection.password,{
    host:config.connection.host,
    dialect:'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Admin = AdminModel(sequelize,Sequelize);
const User = UserModel(sequelize,Sequelize);
const Town = TownModel(sequelize,Sequelize);
const Area = AreaModel(sequelize,Sequelize);
const Restaurant = RestaurantModel(sequelize,Sequelize);
const Menu = MenuModel(sequelize,Sequelize);
const Blog = BlogModel(sequelize,Sequelize);
const Book = BookModel(sequelize,Sequelize);
const PasswordReset = PasswordResetModel(sequelize,Sequelize);

const RestaurantLocations = sequelize.define('restaurantlocations', {
    time: Sequelize.DataTypes.STRING,
    fees: Sequelize.DataTypes.DECIMAL
});

const Order = OrderModel(sequelize,Sequelize);
const OrderItems = OrderItemsModel(sequelize,Sequelize);

Area.belongsTo(Town); //town_id added to area
Town.hasMany(Area); //town_id added to area
Restaurant.belongsToMany(Area, {through: RestaurantLocations});
Area.belongsToMany(Restaurant, {through: RestaurantLocations});
Town.hasMany(RestaurantLocations);
RestaurantLocations.belongsTo(Town);
RestaurantLocations.belongsTo(Area);
Restaurant.hasMany(Menu);
RestaurantLocations.belongsTo(Restaurant);
Menu.belongsTo(Restaurant);
Order.belongsTo(User);
Order.belongsTo(Area);
OrderItems.belongsTo(Order);
OrderItems.belongsTo(Menu);
Order.hasMany(OrderItems);
// User.hasMany(Order);
// User.belongsTo(Area);


sequelize.sync({force:false})
    .then(()=> console.log('Tables created'))
    .catch(err=> console.log(err));

module.exports ={
    Admin,
    Town,
    Area,
    Restaurant,
    Menu,
    User,
    RestaurantLocations,
    Order,
    OrderItems,
    Blog,
    Book,
    PasswordReset
};

