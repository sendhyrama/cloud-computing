module.exports = function(sequelize, DataTypes){
    const destination = sequelize.define('destination', {
        'destination_id':{
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "null",
            primaryKey: true,
            autoIncrement: true,
            initialAutoIncrement: 1
        },
        'destination_name':{
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"  
        },
        'destination_price':{
            type: DataTypes.BIGINT,
            allowNull: true,
            comment: "null"  
        },
        'destination_desc': {
            type: DataTypes.STRING(10000),
            allowNull: true,
            comment: "null"
        },
        'destination_photo': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
        },
        'destination_coordinate':{
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
        },
        'destination_address':{
            type:DataTypes.STRING,
            allowNull: true,
            comment: "null"
        },
        'destination_averageRating': {
            type: DataTypes.FLOAT,
            allowNull: true,
            comment: "null"
        },
        'city_id': {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "null",
            foreignKey: {
                references: {
                  table: 'city',
                  column: 'city_id'
                }
              }
          },
          'destination_category_id': {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "null",
            foreignKey: {
                references: {
                  table: 'destination_category',
                  column: 'destination_category_id'
                }
              }
          }
    },
    {
        tableName: 'destination',
        timestamps: true,
        freezeTableName: true
    });
    return destination
};