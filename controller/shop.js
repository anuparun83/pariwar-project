const mongoose = require('mongoose')
const validator = require('email-validator');
const Product = require('../models/product.js').Product
const User = require('../models/user.js')
const deliveryDetails = require('../models/deliveryDetails')
const removeImage =require('../util/removeImage');
const state =[ "--select your delivery state--","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Puducherry"];



exports.removeFromwishlist = async (req, res) => {

    for (let i = 0; i < req.user.wishlistItems.length; i++) {

        if (req.user.wishlistItems[i]._id.equals(req.body.productId)) {

            req.user.wishlistItems.splice(i, 1)
            break
        }
    }
    console.log(req.user.wishlistItems)
    req.user.save()
        .then(() => res.redirect('/wishlist'))
        .catch((err) => console.log(err))
}

exports.home = (req, res) => {
     
    let fname = '';

    Product.find({}).then(  (product_data) => {

        let cartlength =0;
        if (req.user) {
           
            for (let i = 0; i < req.user.name.length; i++) {

                fname += req.user.name[i]
                if (req.user.name[i] == ' ') break;
            }
            console.log(req.user.name);
            cartlength =req.user.cartItems.length;
            console.log(cartlength);
            
        }
        console.log(fname);
        res.render('index1', { products: product_data, fname: fname ,cartlength:cartlength})
    })
}
exports.details = async (req, res) => {
   console.log(req.user._id)
    let flag = false;
    const productId = req.params.id;
    const userId = req.user.id;
    const user = await User.findById(userId).populate('wishlist');
    const isProductInWishlist = user.wishlist.some(product => product._id.toString() === productId); 
    
    console.log(isProductInWishlist)
    Product.findOne({ _id: req.params.id }).then( ( product) => {

        let fname = '';
        if (req.user) {
            for (let i = 0; i < req.user.name.length; i++) {

                fname += req.user.name[i]
                if (req.user.name[i] == ' ') break;
            }
        }
        // Product.find({}).then(  (relatedProducts) => {

        res.render('product_details', { product: product, fname: fname,  isProductInWishlist :isProductInWishlist})
        // res.render('product_details', { product: product, fname: fname, flag: flag,relatedProducts:relatedProducts })
        // })
    })
}


exports.getAdmin =(req,res,next)=>{
    let fname = '';

    if (req.user) {
        for (let i = 0; i < req.user.name.length; i++) {

            fname += req.user.name[i]
            if (req.user.name[i] == ' ') break;
        }
    }
    res.render('admin', { fname: fname });
}
exports.postAdminProd =(req,res,next)=>{
    let isLoggedIn =true;
    let msg ='',pa;
    console.log(req.file);
    let store =req.file.path;
    const product =new Product({
        name :req.body.name,
        price :req.body.price,
        fabric :req.body.fabric,
        category:req.body.category,
        description :req.body.description,
        imageUrl: store,
        image:{
            data:req.file.filename,
            content:'image/png'
        }
    })
    product.save()
        .then(() => res.render('success',{msg:102}))
        .catch((err) => console.log(err))
}
exports.getAccount =(req,res,next)=>{

    let fname='';
    if(req.user){
        for(let i=0;i<req.user.name.length;i++ ){
            fname+=req.user.name[i]
            if(req.user.name[i]==' ')break;
        }
    }
    res.render('account',{fname:fname});

}
exports.getmyAddress =(req,res,next)=>{

    let fname='';
    if(req.user){
        for(let i=0;i<req.user.name.length;i++ ){
            fname+=req.user.name[i]
            if(req.user.name[i]==' ')break;
        }
    }
    deliveryDetails.find({userId:req.user._id}).then(  (data) => {

        console.log(data[0]);
        res.render('myaddress', { shippingAddress: data, fname: fname })
    })

}
exports.getNewAddress =(req,res)=>{
    let fname='';
    if(req.user){
        for(let i=0;i<req.user.name.length;i++ ){
            fname+=req.user.name[i]
            if(req.user.name[i]==' ')break;
        }
    }
    
        const country =["India"];
     
    res.render('addNewAddress',{ state ,country,fname:fname});
}
exports.postNewAddress = (req, res) => {
    const userId = req.user._id;
  
    // Delete existing delivery details for the user
    deliveryDetails.deleteMany({ userId })
      .then(() => {
        // Create a new delivery details object
        const newDeliveryDetails = new deliveryDetails({
          name: req.body.name,
          mobileNo: req.body.phoneno,
          city: req.body.city,
          address: req.body.address,
          state: req.body.state,
          country: req.body.countryName,
          pincode: req.body.code,
          userId
        });
  
        // Save the new delivery details
        return newDeliveryDetails.save();
      })
      .then(() => {
        res.render('success', { msg: 103 });
      })
      .catch((err) => {
        console.log(err);
        // Handle the error appropriately
      });
  };
exports.getCart =(req,res)=>{
    let fname ='';
    if(req.user){
    for(let i=0;i<req.user.name.length;i++){
        fname+=req.user.name[i]
        if(req.user.name[i]==' ')break;
    }
   }
   res.render('cart',{ cartItems: req.user.cartItems, fname: fname });

}
exports.removeFromCart = async (req, res) => {

    for (let i = 0; i < req.user.cartItems.length; i++) {

        if (req.user.cartItems[i]._id.equals(req.body.productId)) {

            req.user.cartItems.splice(i, 1)
            break
        }
    }
    console.log(req.user.cartItems)
    req.user.save()
        .then(() => res.redirect('/cart'))
        .catch((err) => console.log(err))
}

 

exports.addToCart =(req,res)=>{
    Product.findOne({_id:req.body.id}).then(prod => {

        return prod;
    }).then(async (data)=>{
        const user =await User.findOne({_id:req.user._id})
        let f=1;
        for(let i=0;i < user.cartItems.length;i++){
            if (user.cartItems[i]._id.equals(data._id)) {

                f = 0
                break
            }
        }
        if (f === 1) {

            user.cartItems.push(data)
            user.save()
                .then(() => console.log('Product successfully added two cart'))
                .catch((err) => console.log(err))
        }
        res.redirect("/cart");

    }).catch(err => {
        console.log(err);
    })
}

exports.getWishlist = (req, res) => {

    let fname = '';

    if (req.user) {
        for (let i = 0; i < req.user.name.length; i++) {

            fname += req.user.name[i]
            if (req.user.name[i] == ' ') break;
        }
    }
    const discount =((Math.floor(Math.random() * (28-16+1)) + 17)/100);
    const wish =req.user.wishlistItems;
    res.render('wishlist', { wishlistItems:wish , fname: fname,discount:discount });
}

exports.addToWishlist = async (req, res) => {

    try {
        const { id } = req.body;
        const userId = req.user._id; // Assuming req.user._id contains the authenticated user's ID
    
        // Find the user by ID
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the product already exists in the wishlist
        const existingProduct = user.wishlistItems.find((product) => product._id.toString() === id);
    
        if (existingProduct) {
          return res.status(400).json({ message: 'Product already in wishlist' });
        }
    
        // Find the product by ID
        const product = await Product.findById(id);
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        // Add the product details to the wishlist array
        user.wishlistItems.push(product);
    
        // Save the updated user document
        await user.save();
    
        res.redirect("/wishlist" );
      } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

exports.getProduct =(req,res,next)=>{
    let fname = '';

    if (req.user) {
        for (let i = 0; i < req.user.name.length; i++) {

            fname += req.user.name[i]
            if (req.user.name[i] == ' ') break;
        }
    }
    Product.find()
        .then(prod => {
            // console.log(user);
            res.render('product', {
                fname: fname,
                produc: prod
            });

        })
}

exports.getBuyNow =async (req,res)=>{
    
    let fname = '';

    if (req.user) {
        for (let i = 0; i < req.user.name.length; i++) {

            fname += req.user.name[i]
            if (req.user.name[i] == ' ') break;
        }
    }
    
    const product =await Product.findOne({_id:req.params.id });
    deliveryDetails.find({userId:req.user._id}).then(  (data) => {

        console.log(data[0]);
        res.render('addressDetail', { data: data, fname: fname,product: product })
    })
    // deliveryDetails.find({userId:req.user._id}).then((data)=>{
    //     res.render('addressDetail',{ data: data, fname: fname, product: product })
    // })
}

exports.getEditPage=async (req,res)=>{
      const prodId =req.params.prodId;
      let fname = '';

    if (req.user) {
        for (let i = 0; i < req.user.name.length; i++) {

            fname += req.user.name[i]
            if (req.user.name[i] == ' ') break;
        }
    }
      Product.findById(prodId).then((prod)=>{
          res.render('editpage',{ product:prod,fname:fname})
      }).catch(err => {
        console.log(err);
    })

}
exports.postEditPage =(req,res,next)=>{
    const prodId =req.body.prodId;
    const name =req.body.name;
    const price =req.body.price;
    const fabric =req.body.fabric;
    const image =req.file;
  
    Product.findById(prodId).then ((prod)=>{
        prod.name=name;
        prod.price=price;
        prod.fabric=fabric;
        
        if(image){
           removeImage.deleteFromFile(prod.imageUrl);
           prod.imageUrl=image.path;
        }
        return prod.save();
    })
    .then(data => {
        res.redirect('/product');
        console.log("data is updated");
    })
    .catch(err => {
        console.log(err);
    })


}

exports.postDeleteProduct=(req,res)=>{

    const prodId =req.params.prodId;

    Product.findById(prodId).then(prod=>{
        return removeImage.deleteFromFile(prod.imageUrl);
    })
    .then(data => {
        return Product.findByIdAndRemove(prodId);
    })
    .then(data => {
        res.redirect('/product');
        console.log("data is deleted");
    })
    .catch(err => {
        console.log(err);
    })
    
}
exports.getEditProfile = (req, res, next) => {

    let fname = '';

    if (req.user) {

        for (let i = 0; i < req.user.name.length; i++) {

            fname += req.user.name[i]
            if (req.user.name[i] == ' ') break;
        }
    }
    let error =0;
     
    res.render('editProfile', {
        user_name: req.user.name,
        name: req.user.name,
        email: req.user.email,
        phoneNo: req.user.phoneNo,
        fname: fname,error:error,
       
    });
}

exports.postEditProfile =(req,res,next)=>{

    const { name, email, phoneNo } = req.body;
    if (name.trim() === '') {
        console.log('fullName cannot be blank');
        res.render('editProfile', {
            error: 1,
            name: name,
            email: email,
            phoneNo: phoneNo
        })
        return;
    }

    console.log(phoneNo);
    // validating Mobile Number
    if (phoneNo.trim().length !== 10) {
        console.log('mobileNo is Invalid');
        res.render('editProfile', {
            error: 2,
            name: name,
            email: email,
            phoneNo: phoneNo
        })
        return;
    }

    // validating email
    if (!validator.validate(email)) {
        console.log('email is not correct');
        // res.redirect('/signup');
        res.render('editProfile', {
            error: 3,
            name: name,
            email: email,
            phoneNo: phoneNo
        })
        return;
    }

    req.user.email = email;
    req.user.name = name;
    req.user.phoneNo = phoneNo;
    let msg ='',pc;
    req.user.save()
        .then(data => {
            res.render('success',{msg:104});
        })
        .catch(err => {
            console.log(err);
        })

}









