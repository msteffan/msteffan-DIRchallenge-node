var Sequelize = require("sequelize");
var sequelize = new Sequelize("postgres:///movie_db");



if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    logging:  true //false
  });
} else {
  // the application is executed on the local machine
  sequelize = new Sequelize("postgres:///movie_db");
}

var User = sequelize.import("../models/user");
var Movie = sequelize.import("../models/movie");

Movie.belongsTo(User);
User.hasMany(Movie);

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: {
    User: User,
    Movie: Movie
  }
}
