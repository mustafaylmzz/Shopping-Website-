const Product = require("../models/product.js");
const Category = require("../models/category.js")
exports.getIndex = (req, res,next) => {
    
    Product.findAll(
        {
        attributes:["id","name","price","imageurl"],
        }
    ).then(products=>{
        Category.findAll().then(categories=>{
            res.render("shop/index", {
                title: "Shopping",
                products: products,
                categories:categories,
                path: "/", // Ana sayfa, path burada doğru ayarlandı
                //isAuthenticated:req.cookies.isAuthenticated==="true",
                //isAuthenticated:req.session.isAuthenticated,
            });
        }).catch(err=>next(err)) 
    }).catch((err)=>{
        next(err)
    })
    
    
};

exports.getProducts = (req, res,next) => {
    Product.findAll(
        {
            attributes:["id","name","price","imageurl"],
        }).then(products=>{
        Category.findAll().then(categories=>{
            res.render("shop/products", {
                title: "Products",
                products: products,
                categories:categories,
                path: "/products" ,
                
            });
        }).catch(err=>next(err)) 
    }).catch((err)=>{
        next(err)
    })
   
    
};
exports.getProductsByCategoryId = (req, res,next) => {
    const model= []
    Category.findAll().then(categories=>{
        model.categories=categories;
        const category=categories.find(i=>i.id==req.params.categoryid)
        return category.getProducts();
        
    }).then(products=>{
        res.render("shop/products", {
            title: "Products",
            products: products,
            categories:model.categories,
            selectedCategory:req.params.categoryid,
            path: "/products" ,
            
        });
    }).catch(err=>next(err))
    
    /*sql
    Product.getProductsByCategoryId(req.params.categoryid).then(products=>{
        Category.getAll().then(categories=>{
            res.render("shop/products", {
                title: "Products",
                products: products,
                categories:categories,
                selectedCategory:req.params.categoryid,
                path: "/products" // "Products" sayfası için doğru path
            });
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
    */
};

exports.getProduct = (req, res,next) => {
    /* 1 . yol 
    Product.findByPk(req.params.id).then((product)=>{
        res.render("shop/product-detail",{
            title:product.name,
            product:product,
            path:"/products",
        })
    }).catch((err)=> console.log(err))
    */
   // 2.yol 
    Product.findOne({
        attributes: ["id", "name", "price", "imageurl", "description", "categoryId"],
        where: { id: req.params.id },
        include: [
            {
                model: Category,
                attributes: ["name"], // Sadece kategori adını alıyoruz
            },
        ],
    })
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }

            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                category: product.category, // İlişkili kategori bilgisi
                path: "/products",
            });
        })
        .catch((err) => next(err));


};


exports.getCart = (req, res,next) => {
    req.user.getCart()
    .then(cart => {
        if (!cart) {
            return req.user.createCart();
        }
        return cart;
    })
    .then(cart => {
        return cart.getProducts().then(products=>{
            res.render("shop/cart", {
                title: "Cart",
                products:products,
                path: "/cart" ,
               
            });
        })
    }).catch(err => next(err));
    
};
exports.postCart = (req, res,next) => {
    const productId = req.body.productId;
    let quantity = 1;
    let userCart;
    req.user.getCart()
        .then(cart => {
            if (!cart) {
                return req.user.createCart(); // Sepet yoksa oluştur
            }
            return cart;
            
        }).then(cart=>{
            userCart = cart;
            return cart.getProducts({ where: { id: productId } });
        }).then(products => {
            
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                
                quantity += product.cartItem.quantity;
                return product;
            }
            return Product.findByPk(productId);
        }).then(product => {
            userCart.addProduct(product, {
                through: {
                    quantity: quantity
                }
            });
        }).then(() => {
            res.redirect("/cart");
        }).catch(err => next(err));
};
exports.postCartItemDelete=(req,res,next)=>{
    const productid=req.body.productid
    req.user.getCart().then(cart=>{
        return cart.getProducts({where:{id:productid}})
    }).then(products=>{
        const product=products[0]
        return product.cartItem.destroy()
    }).then(result=>{
        res.redirect("/cart")
    }).catch(err => next(err));
}
exports.getOrders = (req, res,next) => {
    req.user.getOrders({include:["products"]}).then(orders=>{
        orders.forEach(order => {
            let isOrderValid = true;
        });
        console.log(orders)
        res.render("shop/orders", {
            title: "Orders",
            path: "/orders", 
            orders:orders,
            //isAuthenticated:req.session.isAuthenticated,
        });
    }).catch(err => next(err));
};
exports.postOrder = (req, res,next) => {
    let userCart;
    req.user.getCart().then(cart=>{
        userCart=cart;
        return cart.getProducts();
    }).then(products=>{
        return req.user.createOrder().then(order=>{
            console.log("PRODUCTS",products)
            order.addProducts(products.map(product=>{
                product.orderItem={
                    quantity:product.cartItem.quantity,
                    price: product.price,
                }
                console.log("productorderitem",product.cartItem)
                
                return product
            }))

        }).catch(err=>next(err))

    }).then(()=>{
        userCart.setProducts(null)
    }).then(()=>{
        res.redirect("/orders")
    }).catch(err=>next(err))
};
