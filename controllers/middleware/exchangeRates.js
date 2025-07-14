const dbPromise = require("../../routes/dbPromise.config")

const exchangeRates = async (req,res, next) =>{
try{
    const { currency } = req.body
 let CurrencyRate = ""
      const getCurrentExchangeRate = await dbPromise.query("SELECT * FROM exchange_rates WHERE currency = ?",[ currency])

      if(getCurrentExchangeRate[0].length > 0){
        CurrencyRate = getCurrentExchangeRate[0][0]

        
        return res.json({success: "Exchange rate fetched successfully", currency: CurrencyRate.currency,
          current_rate: CurrencyRate.current_rate,
          country: CurrencyRate.country})
      }else{
       return res.json({
        success: "Exchange rate not found",
          currency: "NGN",
          current_rate: 1,
          country: "Nigeria"
        })

      }
}catch(error){
    console.error("Error updating exchange rates:", error);
    return next()
}
}

module.exports = exchangeRates