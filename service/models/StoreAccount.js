/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StoreAccount', {
    accountId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    storeId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    pointBalance: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    accessDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'StoreAccount'
  });
};
