const db = require("../routes/db.config");

const UploadProduct = async (req, res) => {
  try {
    const {  title, description, imageFiles, price, category } = req.body;
    const thumbnail = imageFiles[0]
    const slug = title.trim().toLowerCase().replace(/\s+/g, '-');
    db.query(
      `INSERT INTO products SET ?`,
      [{ title, description, price, category, thumbnail: thumbnail, slug}],
      async (err, inserted) => {
        if (err) {
          console.log(err)
          return res.json({ error: err });
        }
   
        if (inserted) {
          const newID = inserted.insertId;

          try {
            // Insert Other Images and files
            const imagePromises = imageFiles.map((file) =>
              new Promise((resolve, reject) => {
                db.query(
                  "INSERT INTO files SET ?",
                  [{product_id: newID, file_url: file }],
                  (err, imageInsert) => {
                    if (err) {
                      console.log(err) 
                      return reject(err);
                    }
                    resolve(imageInsert);
                  }
                );
              })
            );
            await Promise.all(imagePromises);

   


            return res.json({ success: "Item Uploaded Successfully" , item_id:inserted.insertId});
          } catch (err) {
            console.log("INTERNAL ERROR: ", err)
            return res.json({ error: err });
          }
        }else{
         return res.json({error:"Could Not Create Product"})
        }
      }
    );
  } catch (error) {
    console.log(error)
    return res.json({ error: error.message });
  }
};

module.exports = UploadProduct;
