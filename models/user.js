module.exports = function(sequelize, Sequelize){
  return sequelize.define("user", {
    name: Sequelize.STRING,
    twitterId: Sequelize.STRING
  });

}
