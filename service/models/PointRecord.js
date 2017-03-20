/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PointRecord', {
    recordId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    storeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    issuePoint: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    issueType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    completeYn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'PointRecord'
  });
};
