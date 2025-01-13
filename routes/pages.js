const express = require("express");
const UploadProduct = require("../controllers/uploadProduct");
const products = require("../controllers/allProducts");
const router = express.Router();
const bodyParser = require("body-parser");
const login_user = require("../controllers/auth/login");
const LoggedIn = require("../controllers/auth/loggedIn");
const singleProduct = require("../controllers/singleProduct");
const otherProducts = require("../controllers/otherProducts");
const RegisterUser = require("../controllers/auth/register");
router.use(express.json());
router.use(bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();  // Store the raw body as a string
    }
  }));

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

router.post("/y/uploadProduct", UploadProduct)
router.post("/y/allProducts", products)
router.post("/y/login", login_user)
router.post("/y/loggedIn", LoggedIn)
router.post("/y/singleProduct", singleProduct) 
router.post("/y/otherProducts", otherProducts)

router.post("/y/register", RegisterUser)



router.get("*", (req,res) =>{
    res.redirect(process.env.CurrentDOMAIN)
})


module.exports = router