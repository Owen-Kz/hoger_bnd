
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { CheckPassword, HashPassword } = require('wordpress-hash-node');
const db = require("../../routes/db.config");

const login_user = async (req, res) => {
   

    const { email, password } = req.body;

    if(!email|| !password) return res.json({ status: "error", error: "Please fill all fields"});

    else{ 
 
    try{
       db.query('SELECT * FROM users WHERE ( email =?) ', [email], async (Err, result) => {
            if(Err) throw Err
            if(!result[0]) return res.json({ status: "error", error: "Incorrect email / password combination"})

            else{
                const isMatch = CheckPassword(password, result[0].password);
                const isMatchBCrypt = await bcrypt.compare(password, result[0].password )
          

                if(isMatch || isMatchBCrypt){        
                    db.query("SELECT * FROM users WHERE ( email =?)", [email], async (err, verified) =>{
                        if(err){
                            return res.json({error:err})
                        }
                        if(verified[0]){

                           

                // create cookie token
                const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                    // httpOnly: true
                })
                // create cookie expiry date 
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                // save cookie 
             
                res.cookie("userRegistered", token, cookieOptions)
                res.cookie("uid",result[0].id, cookieOptions)
                return res.json({ status: "success", success: "User Logged in", userToken: token, userId:result[0].id});
            }else{
                return res.json({error:"Email Not Verified, Please verify you email to continue"})
            }
        })       
            }else{
                return res.json({ status: "error", error: "Incorrect username / password combination"})
            }

            }
            
        })
} catch (error) {
    console.error(error.message)
//   throw new Error('Error executing query: ' + error.message); 
  res.json({error:error.message})
}
    }

}

module.exports = login_user;
 