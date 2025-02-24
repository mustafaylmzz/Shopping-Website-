const User = require("../models/user");
const bcrypt=require("bcrypt")
const nodemailer = require("nodemailer");
const crypto=require("crypto");
const Login = require("../models/login");
const { buffer } = require("stream/consumers");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // .env'den çek
        pass: process.env.EMAIL_PASS  // .env'den çek
    }
});
exports.getLogin=(req,res)=>{
    var errorMessage=req.session.errorMessage 
    delete req.session.errorMessage;
    res.render("account/login",{
        path:"/login",
        title:"Login",
        errorMessage:errorMessage,
    })
   
}
exports.postLogin=(req,res,next)=>{
    const {email,password}=req.body;
    const loginModel=new Login({
        email:email,
        password:password,
    })
    loginModel.validate().then(()=>{
        User.findOne({where:{email}}).then(user=>{
            if(!user){
                req.session.errorMessage="Bu mail adresi ile kayıt bulunamamıştır!"
                req.session.save(function(err){
                    return res.redirect("/account/login")
                })
               
            }
            bcrypt.compare(password,user.password).then(isSuccess=>{
                if(isSuccess){
                    req.session.user=user; 
                    req.session.isAuthenticated=true;
                    return req.session.save(function(err) {
                        var url=req.session.redirectTo ||  "/"
                        delete req.session.redirectTo
                        res.redirect(url)
                    })
                }
                req.session.errorMessage="Hatalı e-posta ya da parola girdiniz!"
                req.session.save(function(err){
                    return res.redirect("/account/login")
                })
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }).catch(err=>{
        let message = "";
        // ValidationError kontrolü
        if (err.name === "SequelizeValidationError") {
            
            err.errors.forEach(error => {
                message += `${error.message}<br>`;
            });
            res.render("account/login",{
                path:"/login",
                title:"Login",
                errorMessage:message,
            })
        } else{
            next(err)
        }
    })
    
}
exports.getRegister=(req,res)=>{
    var errorMessage=req.session.errorMessage 
    delete req.session.errorMessage;
    res.render("account/register",{
        path:"/register",
        title:"Register",
        errorMessage:errorMessage,
        //csrfToken:req.csrfToken(),//submit ettiğimi reqPostlar içinvalidate işlemi yapılıyo
    })
}
exports.postRegister = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            req.session.errorMessage = "Bu mail adresi ile daha önce kayıt yapılmıştır!";
            return req.session.save(() => res.redirect("/account/register"));
        }

        const hashPassword = await bcrypt.hash(password, 12);
        await User.create({ name, email, password: hashPassword });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Kayıt Onayı',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Merhaba, ${name}!</h2>
                    <p>Kayıt işleminiz başarıyla tamamlandı! Shopping ailesine katıldığınız için teşekkür ederiz.</p>
                    <p style="text-align: center;">
                        <img src="https://via.placeholder.com/300x150.png?text=Ho%C5%9F+Geldiniz" alt="Hoş Geldiniz" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
                    </p>
                    <p>Hesabınız artık aktif. Keyifli alışverişler dileriz!</p>
                    <p>Teşekkürler! <br><strong>Shopping Ekibi</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.redirect("/account/login");

    } catch (err) {
        if (err.name === "SequelizeValidationError") {
            const message = err.errors.map(error => error.message).join("<br>");
            return res.render("account/register", {
                path: "/register",
                title: "Register",
                errorMessage: message,
            });
        }
        next(err);
    }
};
exports.getResetPassword=(req,res)=>{
    var errorMessage=req.session.errorMessage 
    delete req.session.errorMessage;

    res.render("account/resetPassword",{
        path:"/reset-password",
        title:"Reset Password",
        errorMessage:errorMessage,
    })
}
exports.postResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            req.session.errorMessage = "Bu mail adresi bulunamadı!";
            return req.session.save(() => res.redirect("/account/reset-password"));
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 saat geçerli
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Parola Resetleme',
            html: `
                <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
                <p>
                    <a href="http://localhost:3000/account/reset-password/${token}">Parolayı resetle</a>
                </p>`
        };

        await transporter.sendMail(mailOptions);
        res.redirect("/account/login");

    } catch (err) {
        next(err);
    }
};
exports.getLogout=(req,res)=>{
    req.session.destroy(function(err) {
        console.log(err)
        res.redirect("/")
      
    })
}
exports.getNewPassword=(req,res,next)=>{
    var errorMessage=req.session.errorMessage 
    delete req.session.errorMessage;

    const token =req.params.token;
    User.findOne({
        resetToken:token,resetTokenExpiration:{
            $gt:Date.now()//kullanım süresi devam eden token
        }
    }).then(user=>{
        
        res.render("account/new-password",{
            path:"/new-passwordd",
            title:"New Password",
            errorMessage:errorMessage,
            userId:user.id.toString(),
            passwordToken:token,
        })
    }).catch(err=>next(err))
}
exports.postNewPassword=(req,res,next)=>{
    const newPassword=req.body.password;
    const token=req.body.passwordToken;
    const userId=req.body.userId;
    let _user
    User.findOne({
        resetToken:token,resetTokenExpiration:{
            $gt:Date.now()//kullanım süresi devam eden token
        },
        id:userId
    }).then(user=>{
        _user=user;
        return bcrypt.hash(newPassword,12);

    }).then(hashedPassword=>{
        _user.password=hashedPassword;
        _user.resetToken=undefined;
        _user.resetTokenExpiration=undefined;
        return _user.save()
    }).then(()=>{
        res.redirect("/account/login")
    }).catch(err=>next(err))
}

