const sequelize=require("../config/db")
const Sequelize=require("sequelize")

const Category=sequelize.define("category",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true,
        
    },
    description: {
        type: Sequelize.TEXT,
        allowNull:true,
    }
})
module.exports=Category;














// const postgresClient=require("../config/db")



// module.exports=class Category{
//     //sınıftan obje türettiğimiz zaman o objenin içii doldurmammaız gerekiyor ve biz class içinde bunu constr ile doldururuz

//     constructor(name,description){
        
//         this.name=name;
//         this.description=description;
//     }   
//     async saveCategory(){
//         const query = await postgresClient.query(
//             "INSERT INTO categories (name, description) VALUES($1, $2) RETURNING *",
//             [this.name, this.description]
//         );
//         console.log(query.rows[0])
//         // Başarıyla eklenen kaydı döndür
//         return query.rows[0];
//     }
//     static async getAll(){
//         const query = await postgresClient.query("Select * from categories");
//         return query.rows
//     }
//     static async getById(id){
//         const query = await postgresClient.query("Select * from categories where id=$1",[id]);
       
//         return query.rows[0]
//     }
//     static  async Update(category){
//         const query = await postgresClient.query("UPDATE categories SET name=$1,description=$2 WHERE id=$3",[category.name,category.description,category.id]);
//         return query.rows[0]
//     }
//     static async DeleteById(id){
//         return await  postgresClient.query("DELETE FROM categories WHERE id=$1", [id]);
         
//      }
// }





