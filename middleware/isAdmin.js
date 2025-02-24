module.exports=(req,res,next)=>{
    if(!req.session.isAuthenticated){
        return res.redirect("/account/login")
    }
    if(!req.user.isAdmin){
        return res.redirect("/")
    }
    next()
}