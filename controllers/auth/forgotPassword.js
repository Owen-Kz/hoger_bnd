const { configDotenv } = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const db = require('../../routes/db.config');
const client = SibApiV3Sdk.ApiClient.instance;

const forgotPassword = async (req,res) =>{
    const {email} = req.body 
    try{

        async function SendMain(email, to){
            const response = await apiInstance.sendTransacEmail(email);
        }
    async function GenerateRandomCode(){
        return Math.floor(100000 + Math.random() * 900000);
    }
// Configure API key authorization
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API;


    const currentYear = new Date().getFullYear();
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const resetCOde =  await GenerateRandomCode()

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, user) =>{
        if(err){
            return res.json({error:err})
        }
        if(user[0]){
            const username = user[0].u_name
            const UserEmail = user[0].email 

            db.query("UPDATE users SET resetToken = ? WHERE email = ?",[resetCOde, UserEmail],  async (err, resetTokenSaved) =>{
                if(err){
                    return res.json({error:err})
                }else{
                    const email = {
                        // to: [{ email: to, name: 'Recipient Name' }],
                        to: [{ email: UserEmail, name: username}],
                
                        sender: { email: 'support@hluxegift.com', name: 'Amaslink' },
                        subject: "Password Reset Token",
                        htmlContent: `<html><body>
                        <p>Hello, ${username}, Your 6-digit reset code is </p>
                        <p><h4>${resetCOde}</h4></p>
                        <p>Ignore if you didn't make this request</p>
                        <p>${currentYear} (c) Amaslink.com
                        </body></html>`
                };
                await SendMain(email, UserEmail)
                return res.json({success:"Reset Password Email Sent" })
                }
            })
        }else{
            return res.json({error:"User not found"})
        }
    })
 

    }catch(error){
        return res.json({error:error})
    }
}


module.exports = forgotPassword