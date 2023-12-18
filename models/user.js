module.exports = function(sequelize, DataTypes){ // ini kalau pakai sequelize define kan setiap di run perbarui database. nah ini erornya gara" yang di buat itu urut dari atas jadi city, destination dll. nah kalau ada reference key ke user jadinya eror soanya table usernya belum di buat. table usernya di urutan bawah
    const user = sequelize.define('user', {
        'user_id': {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "null",
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            defaultValue: 404,
            startValue: 404
        },
        'user_email':{
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
        },
        'user_username':{
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
        },
        'user_password': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
        },
        'user_fullname': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
          },
          'user_phoneNumber': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
          },
          'user_address': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
          },
          'user_profile': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
          },
          'otp': {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "null"
          },
          "otpVerified": {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
        }, {
          tableName: 'user',
          timestamps: true,
          freezeTableName: true
    });
    
    return user;
};
