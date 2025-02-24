const express=require("express")
const bodyParser=require("body-parser")
const adminRouters=require("./routers/admin")
const userRouters=require("./routers/shop.js")
const path=require("path")
const errorController=require("./controllers/error.js")
const sequelize=require("./config/db.js")
const Category=require("./models/category.js")
const Product=require("./models/product.js")
const User=require("./models/user.js")
const Cart=require("./models/cart.js")
const CartItem=require("./models/cartItem.js")
const Order=require("./models/order.js")
const OrderItem=require("./models/orderItem.js")
const accountRouters=require("./routers/account.js")
const cookieParser=require("cookie-parser")
const session = require('express-session')
var SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf=require("csurf")

const cors=require("cors")
const multer=require("multer")


const app=express()


app.set("view engine","pug")
app.set("views","./views")

app.use(express.static(path.join(__dirname,"public")))

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/img/")
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
})


app.use(bodyParser.urlencoded({extended:false}))
app.use(multer({ storage: storage }).single("imageurl"));

app.use(cookieParser())
app.use(cors())
app.use(session({
    secret :"keyboard cat",//sessiona bağlanmak için şifre
    resave: false, //sessionan eski bilgilerle set edilip edilmemesi
    saveUninitialized:false,//her kullanıcı için ssesioncokie oluşturcak kullanıcı tarafı için sunucu taraf iiçin boş session oluşturcak gerkssizde yapabilyo
    cookie:{
        maxAge:3600000,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
})) 
// kullanıcı oturumunu aktif bir şekilde uygulama boyunca taşımak
//  ve kullanıcının ilişkili olduğu diğer verilere erişim sağlamak.
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findByPk(req.session.user.id).then(user=>{
        req.user=user;
        
        next()
    }).catch(err=>console.log(err))
})

app.use(csurf())

app.use("/admin",adminRouters)
app.use("/",userRouters)
app.use("/account",accountRouters)
app.use("/500",errorController.get500Page)
//herhangi bir route bizim isteğimizi karşılayamıyosa
//herhangi bir url ye bağlı olmayanbir mware ı en son çalıştırdık
app.use(errorController.get404Page)
// app.use((error,req,res,next)=>{
//     res.status(500).render("500",{title:"Error Page"})
//     //url değişmedi yine app-productakaldık
// })


Product.belongsTo(Category, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE' });


Category.belongsTo(User);
User.hasMany(Category);

Product.belongsTo(User);
User.hasMany(Product);

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });


let _user;
sequelize
    //.sync({ force: true }) // Tabloları sıfırdan oluştur
    .sync()
    .then(() => {
        console.log("Veritabanı senkronize edildi.");
        
        
    })
    .catch(err => console.error("Veritabanı hatası:", err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} çalıştı`);
});



