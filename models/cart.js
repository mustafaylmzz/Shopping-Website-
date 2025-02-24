const sequelize=require("../config/db")
const Sequelize=require("sequelize")

const Cart=sequelize.define("cart",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true,
    },
})
module.exports=Cart;
