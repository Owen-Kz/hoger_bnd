
const db = require('../routes/db.config');

const products = async (req,res) =>{
    const {page} = req.body
    let items_per_page = 20
    const OFFSET  = (page - 1) * items_per_page
    // const offset = (page - 1) * ITEMS_PER_PAGE; 
    let totalPages = 0
    let LimitFile = 0
    let search = ""
    if(req.body.search){
        const searchQuery = req.body.search 
        // const searchBY = req.body.by 
        db.query("SELECT COUNT(*) AS sumproducts FROM products WHERE (LOWER(title) COLLATE utf8mb4_unicode_ci LIKE LOWER(?) OR LOWER(description) COLLATE utf8mb4_unicode_ci LIKE LOWER(?) OR LOWER(category) COLLATE utf8mb4_unicode_ci LIKE LOWER(?))",[`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`], (err, CountResult) => {
            if (err) {
              console.error(err);
              return res.json({error:"Internal Server Error"});
            }
            const Count = JSON.stringify(CountResult[0]["sumproducts"]);
            totalPages = Math.ceil(Count / items_per_page);
            LimitFile = Math.ceil(Count / 1)
    
    
        db.query("SELECT * FROM products WHERE (LOWER(title) COLLATE utf8mb4_unicode_ci LIKE LOWER(?) OR LOWER(description) COLLATE utf8mb4_unicode_ci 	 LIKE LOWER(?) OR LOWER(category) COLLATE utf8mb4_unicode_ci LIKE LOWER(?))  ORDER BY id DESC LIMIT ? OFFSET ?",[`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, LimitFile, OFFSET], async (err,result)=>{
            if(err){
                // throw err
                console.log(err)
               return res.json({error:err})
            }
    
            if(result.length > 0){
              
                return res.json({success:"products", products:result,  pageCount:page,
                    totalCount: totalPages})
            }else{
                return res.json({success:"products", products:[],  pageCount:page,
                    totalCount: totalPages})
            }
        })
            
        })
    }else{


    db.query("SELECT COUNT(*) AS sumproducts FROM products WHERE 1", (err, CountResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        const Count = JSON.stringify(CountResult[0]["sumproducts"]);
        totalPages = Math.ceil(Count / items_per_page);
        LimitFile = Math.ceil(Count / 1)


    db.query("SELECT * FROM products WHERE 1 ORDER BY id DESC LIMIT ? OFFSET ?",[LimitFile, OFFSET], async (err,result)=>{
        if(err){
            // throw err
            console.log(err)
           return res.json({error:err})
        }

        if(result.length > 0){
          
            return res.json({success:"products", products:result,  pageCount:page,
                totalCount: totalPages})
        }else{
            return res.json({success:"products", products:[],  pageCount:page,
                totalCount: totalPages})
        }
    })
        
    })
}
}

module.exports = products