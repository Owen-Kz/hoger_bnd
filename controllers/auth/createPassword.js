const db = require("../../routes/db.config")
const bcrypt = require("bcryptjs");


const createPassword = async (req,res) =>{
    try{
    
        const {email, newPassword} = req.body 
        const pass = await bcrypt.hash(newPassword, 8);
        db.query("UPDATE users SET password = ? WHERE email = ?", [pass, email], async (err, data) =>{
            if(err){
                console.log(err)
                return res.json({error:err})
            }
            if(data.affectedRows > 0){
                return res.json({success:"New Password Created Successfully"})
            }
        })
    }catch(error){
        return res.json({error:error.message})
    }
}


module.exports = createPassword