module.exports = function(sequelize, Sequelize){
  return sequelize.define("movie", {
    title: Sequelize.STRING,
    imdbId: Sequelize.STRING,
  });
}
