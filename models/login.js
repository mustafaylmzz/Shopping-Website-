
const sequelize=require("../config/db")
const Sequelize=require("sequelize")
const {isEmail}=require("validator")

const Login=sequelize.define("login",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true,
    },
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
                msg: "Hatalı email adresi." // E-posta formatı geçerli değilse hata
            },
        },
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
        validate: {
            notEmpty: {
                args: true, 
                msg: "parola alanı boş olamaz." // Boş email kontrolü
            },
        },
    }
})

module.exports=Login
