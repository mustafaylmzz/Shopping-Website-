module.exports=(req,res,next)=>{
    if(!req.session.isAuthenticated){
        req.session.redirectTo=req.url;//gitmekistedğisayfavarsa
        return res.redirect("/account/login")
    }
    next()
}
