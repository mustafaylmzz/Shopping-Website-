const Product = require("../models/product");
const Category=require("../models/category");
const User = require("../models/user");
const fs=require("fs")
exports.getAddProduct = (req, res,next) => {
    Category.findAll().then((categories)=>{
        res.render("admin/add-product", {
            title: "Add Product", 
            path: "/admin/add-product",
            categories:categories,
            inputs: { // inputs nesnesini burada boş olarak gönderiyoruz
                name: "",
                price: "",
                description: "",
                imageurl: "",
                categoryid: "-1",
            }
           // isAuthenticated:req.session.isAuthenticated,
        });
    }).catch(err=>next(err))
    
};
exports.postAddProduct = (req, res,next) => {
    const name = req.body.name;
    const price = req.body.price;
    const file = req.file;
    const categoryid = req.body.categoryid;
    const description = req.body.description;
    const user = req.user;
    
    if (!file) {
        return Category.findAll()
            .then(categories => {
                res.render("admin/add-product", {
                    title: "Add Product",
                    path: "/admin/add-product",
                    categories: categories,
                    errorMessage: "Lütfen resim giriniz",
                    inputs: {
                        name: name || "",
                        price: price || "",
                        description: description || "",
                        imageurl: "", // Resim boş olacak
                        categoryid: categoryid || "-1",
                    },
                });
            })
            .catch(err => next(err)); // Kategori çekme hatası
    }


    Category.findAll()
        .then(categories => {
            user.createProduct({
                
                name: name,
                price: price,
                imageurl: file.filename,
                description: description,
                categoryId: categoryid,
                tags: ["asd"]
            })
            .then(() => {
                res.redirect("/");
            })
            .catch(err => {
                let message = "";
                // ValidationError kontrolü
                if (err.name === "SequelizeValidationError") {
                    
                    err.errors.forEach(error => {
                        message += `${error.message}<br>`;
                    });
                    // Formu hata mesajı ile yeniden render et
                    res.render("admin/add-product", {
                        title: "Add Product",
                        path: "/admin/add-product",
                        categories: categories, // Kategoriler buradan gönderiliyor
                        errorMessage: message,
                        inputs: {
                            name: name || "",
                            price: price || "",
                            description: description || "",
                            imageurl: imageurl || "",
                            categoryid: categoryid || "-1",
                        },
                    });
                }else{
                    //1-hata mesajı
                    /*
                    res.status(500).render("admin/add-product", {
                        title: "Add Product",
                        path: "/admin/add-product",
                        categories: categories, // Kategoriler buradan gönderiliyor
                        errorMessage: "Beklenmedik bir hata oluştu",
                        inputs: {
                            name: name || "",
                            price: price || "",
                            description: description || "",
                            imageurl: imageurl || "",
                            categoryid: categoryid || "-1",
                        },
                    });
                    */
                    //2-yönlendirme
                    /*
                    res.redirect("/")
                    */
                    //3- 500 page
                    //res.redirect("/500")
                    //3.1-500page ı mware ile tasarlarız
                    next(err) //sürec içine err u req içine atar indexte mware ilekarşılarız
                }
                
            });
        })
        .catch(err => console.error("Kategori çekme hatası:", err));

    /* 1.2 producttan ürün oluşturma
    
    Product.create({
        name:name,
        price:price,
        imageurl:imageurl,
        description:description,
        categoryId:categoryid,
        userId:user.id,
    }).then(result=>{
        
        res.redirect("/")
    }).catch(err=>console.log(err))
    */
    /* 2 sequlize veri ekleme 
    // non persistens
    const prdct=Product.build({
        name:name,
        price:price,
        imageurl:imageurl,
        description:description
    });
    prdct.save().then(result=>{
        console.log(result)
        res.redirect("/")
    }).catch(err=>console.log(err))
    */
    //sql sorugulu
    // product.saveProduct().then(()=>{
    //     res.redirect("/admin/products");
    // }).catch(err=>console.log(err));
    
};
exports.getEditProduct = (req, res,next) => {
    
    Product.findOne({where:{
        id:req.params.id,
        userId:req.user.id
    }}).then((product)=>{
        if(!product){
            return res.redirect("/")
        } 
        return product;
    }).then(product=>{
        Category.findAll().then(categories=>{
            categories=categories.map(category=>{
                if(product.categories){
                    product.categories.find(item=>{
                        if(item.toString()===categories.id.toString()){
                            categories.selected=true;
                        }
                    })
                }
                return category
            })
            res.render("admin/edit-product",{
                title:"Edit Product",
                path:"/admin/products",
                product:product,
                categories:categories,
                
            })
        })
    }).catch(err=>next(err))
        
};
exports.postEditProduct = (req, res,next) => {
   console.log("render")
    
    const id = req.body.id;
    const name = req.body.name;
    const file = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const categoryid = req.body.categoryid;
    
    
    Product.findOne({where:{
        id:id,
        userId:req.user.id
    }}).then(product=>{
        if(!product){
            return res.redirect("/admin/products")
        }
        product.name=name
        product.price=price
        product.description=description;
        product.categoryId=categoryid;
        if(file){
            fs.unlink("public/img/"+product.imageurl,err=>{
                if(err){
                    console.log(err)
                }
            })
            product.imageurl=file.filename
        }
        return product.save();

    }).then(()=>{
        
        res.redirect("/admin/products?action=edit");
    }).catch(err=>{
        let message = "";
                // ValidationError kontrolü
                if (err.name === "SequelizeValidationError") {
                    
                    err.errors.forEach(error => {
                        message += `${error.message}<br>`;
                    });
                    // Formu hata mesajı ile yeniden render et
                    res.render("admin/edit-category", {
                        title: "Add Product",
                        path: "/admin/categories",
                        errorMessage: message,
                        inputs: {
                            name: name || "",
                            description: description || "",
                            
                        },
                    });
                }else{
                    next(err)
                }
    })
    
    //sql sorgusu
    // Product.Update(product).then((product)=>{
    //     res.redirect("/admin/products?action=edit");
    // }).catch(err=>console.log(err))
    
};
exports.postDeleteProduct=(req, res,next) => {
   
   
    Product.findOne({where:{
        id:req.body.id,
        userId:req.user.id
    }}).then(product=>{
        if(!product){
            return next(new Error("silinmek istenen ürün bulunamadı"))
        }
        fs.unlink("public/img/"+product.imageurl,err=>{
            if(err){
                console.log(err)
            }
        })
        return product.destroy();
    }).then(()=>{
        
        res.redirect("/admin/products?action=delete")
    }).catch(err=>next(err))
   /* 1 . yöntem
    Product.destroy({where : {id:req.body.id}})
        .then(()=>{
            res.redirect("/admin/products?action=delete")
        }).catch(err=>console.log(err))
    */
    /* sql
    Product.DeleteById(req.body.id).then((product)=>{
        res.redirect("/admin/products?action=delete")
    }).catch(err=>console.log(err))
    */
   
};
exports.getProducts = (req, res,next) => {
    
    Product.findAll({where:{userId:req.user.id}}).then(products=>{
        res.render("admin/products", {
            title: "Admin Products",
            products: products,
            user:req.user,
            action:req.query.action,
            path: "/admin/products" 
        });
    }).catch((err)=>{
        next(err)
    })
};
exports.getCategories = (req, res,next) => {
    
    Category.findAll().then(categories=>{
        res.render("admin/categories", {
            title: "Admin categories",
            categories:categories ,
            user:req.user,
            action:req.query.action,
            path: "/admin/categories" 
        });
    }).catch((err)=>{
        next(err)
    })
};
exports.getAddCategory = (req, res,next) => {
    Category.findAll().then((categories)=>{
        res.render("admin/add-category", {
            title: "Add Category", 
            path: "/admin/add-category",
            categories:categories,
            inputs: { // inputs nesnesini burada boş olarak gönderiyoruz
                name: "",
                description: "",   
            }
        });
    }).catch(err=>next(err))
    
};
exports.postAddCategory = (req, res,next) => {
    const name = req.body.name;
    const description = req.body.description;
    const user = req.user;
    
    Category.findAll()
        .then(categories => {
            user.createCategory({        
                name: name,           
                description: description,
            })
            .then(() => {
                res.redirect("/admin/categories");
            })
            .catch(err => {
                let message = "";
                // ValidationError kontrolü
                if (err.name === "SequelizeValidationError") {
                    
                    err.errors.forEach(error => {
                        message += `${error.message}<br>`;
                    });
                    // Formu hata mesajı ile yeniden render et
                    res.render("admin/add-category", {
                        title: "Add Category",
                        path: "/admin/add-category",
                        categories: categories, // Kategoriler buradan gönderiliyor
                        errorMessage: message,
                        inputs: {
                            name: name || "",
                            description: description || "",
                        },
                    });
                }else{
                    
                    next(err) 
                }
                
            });
        })
        .catch(err => console.error("Kategori çekme hatası:", err));

   
    
};
exports.getEditCategories = (req, res, next) => {
    const categoryId = req.params.id;

    // Kullanıcıya ait belirli bir kategori bul
    Category.findOne({
        where: {
            id: categoryId,
            
        },
    })
    .then(category => {
        if (!category) {
            
            return res.redirect("/admin/categories");
        }
        res.render("admin/edit-category", {
            title: "Edit Category",
            path: "/admin/categories",
            category: category,
        });
    })
    .catch(err => next(err)); // Hata yönetimi
};
exports.postEditCategories = (req, res, next) => {
    const categoryId = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Category.findOne({
        where: {
            id: categoryId,
            userId: req.user.id,
        },
    })
    .then(category => {
        if (!category) {
            return res.redirect("/admin/categories");
        }

        // Kategori bilgilerini güncelle
        category.name = name;
        category.description = description;

        // Güncellenen kategoriyi kaydet
        return category.save();
    })
    .then(() => {
        // Kategori başarıyla güncellenirse yönlendir
        res.redirect("/admin/categories?action=edit");
    })
    .catch(err => {
        if (err.name === "SequelizeValidationError") {
            // Validasyon hatalarını işleme
            const message = err.errors.map(error => error.message).join("<br>");
            return res.render("admin/edit-category", {
                title: "Edit Category",
                path: "/admin/categories",
                errorMessage: message,
                inputs: { name, description },
            });
        }
        next(err); // Diğer hatalar için error middleware'e yönlendirme
    });
};
exports.getDeleteCategory = (req, res, next) => {
    const categoryId = req.params.id;

    console.log("Kategori ID'si:", categoryId);  // categoryId'nin doğru alındığını kontrol et

    Category.findOne({
        where: { id: categoryId },
        include: [{ model: Product, as: 'products' }],
    }) 
    .then(category => {
        if (!category) {
            console.log("Kategori bulunamadı");  // Kategori verisi kontrolü
            return next(new Error("Silinmek istenen kategori bulunamadı"));
        }

        console.log("Kategori ve Ürünler:", category);
        console.log("Ürünler:", category.products);

        return res.render("admin/delete-category", {
            title: "Delete Category",
            path: "/admin/delete-category",
            category: category,
            products: category.products,
            user:User
        });
    })
    .catch(err => {
        console.error("Hata:", err);
        next(err);
    });
};
exports.postDeleteCategory = (req, res, next) => {
    const categoryId = req.body.id;
    console.log("Silinecek Kategori ID:", categoryId);

    // 1. Kategoriyi bul ve ilişkili ürünleri al
    Category.findOne({
        where: { id: categoryId },
        include: [{ model: Product }] // İlişkili ürünleri alıyoruz
    })
    .then(category => {
        if (!category) {
            throw new Error('Silinmek istenen kategori bulunamadı.');
        }

        // 2. İlgili ürünleri toplu olarak sil
        return Product.destroy({ where: { categoryId: categoryId } })
            .then(() => {
                // 3. Kategoriyi sil
                return category.destroy();
            });
    })
    .then(() => {
        console.log('Kategori ve ürünler başarıyla silindi.');
        res.redirect('/admin/categories?action=delete');
    })
    .catch(err => {
        console.error('Hata:', err);
        next(err);
    });
};

