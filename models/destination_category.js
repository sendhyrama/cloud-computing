module.exports = function(sequelize, DataTypes){
    const destination_category = sequelize.define('category',{
        'destination_category_id':{
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "null",
            primaryKey: true,
            autoIncrement: true,
            initialAutoIncrement: 1
          },
          'destination_category_name':{
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"   
          }
        }, 
        {
            tableName: 'destination_category',
            timestamps: true,
            freezeTableName: true
        });
        return destination_category
};