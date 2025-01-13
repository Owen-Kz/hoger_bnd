// const WPHash = require('wordpress-hash-node');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { configDotenv } = require('dotenv');
const db = require('../../routes/db.config');


// Configure API key authorization

async function getRandomString() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 15;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    return bufferID
}
const RegisterUser = async (req,res) =>{


try{

    const { password, email} = req.body;
    const hPassword = await bcrypt.hash(password, 8);

    const bufferToken = await getRandomString()

    if(email, password){
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) =>{
            if(err){
                throw err
            }
            if(result[0]){
                res.json({error:"User Already Exists"})
            }else {
               function FinalCreateAccount() {
                    db.query('INSERT INTO users SET ?',{
                       
                        email:email,
                        password:hPassword, 
                        resetToken:bufferToken,
                        } , async (err, result) =>{
                        if(err){
                            console.log(err)
                        }
               
                        if(result){
                             const token = jwt.sign({id: result.insertId}, process.env.JWT_SECRET, {
                                           expiresIn: process.env.JWT_EXPIRES
                                           // httpOnly: true
                                       })
                            // res.json({success:"Account Created Succesfully"})
                            return res.json({ status: "success", success: "Account Created", userToken: token, userId:result.insertId});
                        }else{
                            
                            res.json({error:"Could not create account at the moment"})
                        }
                        
                    })
                }
                FinalCreateAccount()
           
               
            }
        })
    }

}catch(error){
    return res.json({error:error.message})
}

}

module.exports = RegisterUser