/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StoreInfo', {
    storeId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pwd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    storeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    useYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delYn: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'StoreInfo'
  });
};
