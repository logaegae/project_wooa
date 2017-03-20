/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MemberInfo', {
    memberId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthDay: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'MemberInfo'
  });
};
