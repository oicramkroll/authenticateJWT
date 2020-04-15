module.exports = {
    home:(req,res)=>{
        
        res.json({ok:`Pagina intenrna com usuario ${req.userId}`})
    }
}