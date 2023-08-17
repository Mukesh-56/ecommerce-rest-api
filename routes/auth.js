const router = require("express").Router();
const User = require("../models/User")
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString(),
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
    
});

//LOGIN

router.post("/login", async (req, res)=>{
    try{

        const user = await user.findOne({username: req.body.username});
        !user && res.status(401).json("Wrong credentials!");

        const hashedPassword= CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const Realpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        Realpassword !== req.body.password &&
          res.status(401).json("Wrong credentials!");

        const acessToken =  jwt.sign(
          { 
            id:user._id, 
            isAdmin: user.isAdmin,
          }, 
          process.env.JWT_SEC,
          {expiresIn:"3d"}
        );
        const { password, ...others } = user._doc;

        res.status(200).json(...others, acessToken);
    }catch(err){
        res.status(500).json(err)
    }
});

module.exports = router;