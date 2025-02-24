const { isLowercase } = require("validator");
const sequelize = require("../config/db");
const Sequelize = require("sequelize");

const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false, // Mutlaka değer girilmesi gerekli
        primaryKey: true,
        
    },
    name: {
        type:Sequelize.STRING,
        isLowercase:true,
        set(value) {
            this.setDataValue('name', value.trim().toLowerCase());
        }
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Fiyat negatif olamaz.",
            },
            notEmpty: {
                msg: "Fiyat alanı boş olamaz.",
            },
        },
        get() {
            const value = this.getDataValue('price'); 
            return Math.round(value); // Değeri döndürüyoruz
        },
        set(value) {
            this.setDataValue('price', Math.round(value)); 
        }
    },
    imageurl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false, // Alan boş bırakılamaz
        defaultValue: [], // Varsayılan olarak boş bir dizi atanır
        validate: {
            function(value) {
                if (!value || value.length === 0) {
                    throw new Error("Ürün için etiket ekle.");
                }
            },
        },
    },
});

module.exports = Product;
