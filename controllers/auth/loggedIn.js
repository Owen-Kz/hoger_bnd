
const jwt = require("jsonwebtoken");
const db = require("../../routes/db.config");

const LoggedIn = (req, res, next) => {
    const {token} = req.body
  if (!token) {
    // Redirect to home if user is not logged in
    return res.json({error:"UserNotLoggedIn"})
  }

  try {
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.query("SELECT * FROM users WHERE id = ? ", [decoded.id], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({error:"Could Not Get data"}) // Redirect to home on error
      }

      return res.json({success:"IsLoggedIn", user:result[0]});
    //   next();
    });
  } catch (error) {
    console.log(error);
    return res.json({error:"Internal Server Error"})
  }
};

module.exports = LoggedIn;
