module.exports = function(sequelize, DataTypes) {
    const destination_wishlist =  sequelize.define('destination_wishlist', {
      'destination_wishlist_id': {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "null",
        primaryKey: true,
        autoIncrement: true,
        initialAutoIncrement: 1
      },
      'user_id': {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "null",
        foreignKey: {
            references: {
              table: 'user',
              column: 'user_id'
            }
          }
      },
      'destination_id': {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "null",
        foreignKey: {
            references: {
              table: 'destination',
              column: 'destination_id'
            }
          }
      }
    }, {
      tableName: 'destination_wishlist',
      timestamps: true,
      freezeTableName: true
    });
    return destination_wishlist
  };