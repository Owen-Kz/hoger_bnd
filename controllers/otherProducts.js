const db = require("../routes/db.config")

const otherProducts = async (req,res) =>{
    try{
        const {c}  = req.body 
        db.query("SELECT * FROM products WHERE category = ?", [c], async (err, data) =>{
            if(err){
                return res.json({error:err})
            }else{
                return res.json({success:"otherProducts", otherProducts:data})
            }
        })
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}


module.exports = otherProducts