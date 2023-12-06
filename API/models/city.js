module.exports = function(sequelize, DataTypes){
    const city = sequelize.define('city',{
        'city_id' : {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment:"null",
            primaryKey: true,
            autoIncrement: true,
            initialAutoIncrement: 1
        },
        'city_name': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
        }
    }, 
    {
            tableName: 'city',
            timestamps: false,
            freezeTableName: true
    });
    return city;
}