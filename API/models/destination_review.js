module.exports = function(sequelize, DataTypes) {
    const destination_review = sequelize.define('destination_review', {
      'destination_review_id': {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "null",
        primaryKey: true,
        autoIncrement: true,
        initialAutoIncrement: 1
      },
      'rating': {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "null",
      },
      'comment': {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "null",
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
    }, 
    {
      tableName: 'destination_review',
      timestamps: true,
      freezeTableName: true
    });
    return destination_review
  };