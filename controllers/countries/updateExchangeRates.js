const dbPromise = require("../../routes/dbPromise.config")



const updateExchangeRate = async (req,res) =>{
    try{
        const {country, countryCode, currency, exchangeRate} = req.body
        // Check if the exchane rate exists 
        const checkExists = await dbPromise.query("SELECT * FROM exchange_rates WHERE country = ? AND currency = ? ", [country, currency])
        if(checkExists[0].length > 0){
            const LastFetch = checkExists[0][0].last_fetch
            const twoWeeksAgo = 0
            const TWO_WEEKS_MS = 1000 * 60 * 60 * 24 * 14;
            const rows = checkExists[0]

    const lastRun = rows.length > 0 ? new Date(rows[0].LastFetch) : null;
    const now = new Date();


    const shouldRun = !lastRun || (now - lastRun > TWO_WEEKS_MS);
            if(shouldRun){
                const updateNewRate = await dbPromise.query("UPDATE exchange_rates SET current_rate = ? WHERE country = ? AND currency = ? AND country_code = ?", [exchangeRate, country, countryCode, currency])
                return res.json({success:"Exchange rate updated successfully"})
            }else{
                return res.json({success:"This entry was fetched recently"})
            }
        }else{
            const CreateEntry = await dbPromise.query("INSERT INTO exchange_rates SET ?",[{country, country_code:countryCode, currency, current_rate:exchangeRate}])
            return res.json({success:"Exchange rate updated"})
        }
    }catch(error){
        console.log(error)
        return res.json({error:error.message})
    }
}

module.exports = updateExchangeRate