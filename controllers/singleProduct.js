const { config } = require("dotenv")
const db = require("../routes/db.config")

const singleProduct = async (req,res) =>{
    try{
        const {slug} = req.body 
        db.query("SELECT * FROM products WHERE slug = ?", [slug], async(err,data) =>{
            if(err){
                console.log(err)
              return  res.json({error:err})
            }else if(data[0]){
                const itemId = data[0].id 
                db.query("SELECT * FROM files WHERE product_id = ?", [itemId], async(error, file) =>{
                    if(error){
                        return res.json({error:error})
                    }else{
                        const files = file
                     
                        const ContactLink = `https://wa.me/${process.env.WhatsApp}?text=I'm%20inquiring%20about%20the%20${data[0].slug}`
                        
                        const whatsAppMessage = `https://wa.me/${process.env.WhatsApp}?text=I'm%20inquiring%20about%20the%20`

                        return res.json({success:"products", product:data[0], files:files, contactLink:ContactLink, whatsapp:whatsAppMessage})
                    }
                })
            }else{
                res.json({error:"Could not Retrive data"})
            }
        })
    }catch(error){
        console.log(error)
        res.json({error:error.message})
    }
}


module.exports = singleProduct