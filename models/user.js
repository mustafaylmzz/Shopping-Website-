
const sequelize=require("../config/db")
const Sequelize=require("sequelize")
const {isEmail}=require("validator")

const User=sequelize.define("user",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true,
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        validate: {
            notEmpty: {
                args: true, 
                msg: "Email alanı boş olamaz." // Boş email kontrolü
            },
            isEmail: {
                args: true, 
                msg: "Geçersiz email adresi." // E-posta formatı geçerli değilse hata
            },
        },
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    resetToken:Sequelize.STRING,
    resetTokenExpiration:Sequelize.DATE,
    
    isAdmin:{
        type:Sequelize.BOOLEAN,
        default:true,
    },
})

module.exports=User
