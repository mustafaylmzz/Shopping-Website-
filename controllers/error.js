module.exports.get404Page=(req,res)=>{
    // res.status(404).sendFile(path.join(__dirname,"views","404.html"))
     res.render("404",{title:"Page No Found"})
    
}
module.exports.get500Page=(req,res)=>{
    // res.status(404).sendFile(path.join(__dirname,"views","404.html"))
     res.render("500",{title:"Error Page"})
    
}