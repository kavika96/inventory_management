
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.post('/', auth, async (req,res)=>{
  try{
    const product = new Product({
      user:req.user.id,
      name:req.body.name,
      price:req.body.price,
      quantity:req.body.quantity
    });

    const saved = await product.save();
    res.json(saved);

  }catch(err){
    res.status(500).send("Server Error");
  }
});

router.get('/', auth, async (req,res)=>{
  try{
    const products = await Product.find({user:req.user.id});
    res.json(products);
  }catch(err){
    res.status(500).send("Server Error");
  }
});

router.put('/:id', auth, async (req,res)=>{
  try{
    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({msg:"Product not found"});
    }

    if(product.user.toString() !== req.user.id){
      return res.status(401).json({msg:"Not authorized"});
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;

    await product.save();
    res.json(product);

  }catch(err){
    res.status(500).send("Server Error");
  }
});

router.delete('/:id', auth, async (req,res)=>{
  try{
    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({msg:"Product not found"});
    }

    if(product.user.toString() !== req.user.id){
      return res.status(401).json({msg:"Not authorized"});
    }

    await product.deleteOne();
    res.json({msg:"Product removed"});

  }catch(err){
    res.status(500).send("Server Error");
  }
});

module.exports = router;
