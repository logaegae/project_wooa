/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MemberAccount', {
    accountId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    memberId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'MemberAccount'
  });
};
