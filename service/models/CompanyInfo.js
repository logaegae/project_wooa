/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CompanyInfo', {
    companyId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true
    },
    storeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    homepageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blogUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    integrationPointYn: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'CompanyInfo'
  });
};
