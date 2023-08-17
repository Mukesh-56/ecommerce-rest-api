const Product = require("../models/Product");

const { 
    verifyToken, 
    verifyAuth, 
    verifyAdmin 
} = require("./verifyToken");


const router = require("express").Router();

//CREATE

router.post("/", verifyAdmin, async (req,res)=>{
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyAdmin, async (req,res)=>{
  try{
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body
        },
        {new: true}
      );
      res.status(200).json(updatedProduct);
    } catch(err){
        res.status(500).json(err);
    }
}); 

//DELETE

router.delete("/:id", verifyAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted.");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req,res)=>{
    try{
        const Product = await Product.findById(req.params.id);
        res.status(200).json(Product);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async (req,res)=>{
    const qNew = req.quesry.new;
    const qCategory = req.quesry.Category;
    try{
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory){
            products = await Product.find({
              categories:{
                $in: [qCategory],
              },
          });
        }else{
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;