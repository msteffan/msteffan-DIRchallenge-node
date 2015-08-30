module.exports = function(sequelize, Sequelize){
  return sequelize.define("user", {
    twitterId: Sequelize.STRING
  });

}
