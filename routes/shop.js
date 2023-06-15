const express = require('express')
const router = express.Router()
const isAdminAuth = require('../middleware/isAdminAuth');
const shopController = require('../controller/shop');
const isLoginAuth = require('../middleware/isLoginAuth');
const isAuth = require('../middleware/isAuth');
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// router.get('/', ensureGuest ,(req, res) => {
//     res.render('auth/login')
//   })
router.get("/",ensureGuest,shopController.home)
// router.get("/log",ensureAuth, async(req,res)=>{

//     res.render('index.ejs',{userinfo:req.user})
// })
router.get("/log",ensureAuth,shopController.home);
router.get("/",shopController.home);
router.get("/myaccount",isAuth,shopController.getAccount);
router.get('/addNewAddress',isAuth,  shopController.getNewAddress);
router.get('/myAddress',isAuth,  shopController.getmyAddress);
router.get('/editProfile',isAuth,  shopController.getEditProfile);
router.get('/editPage/:prodId',isAdminAuth,  shopController.getEditPage);
router.get('/wishlist',isAuth,  shopController.getWishlist);
router.get('/admin',isAdminAuth,  shopController.getAdmin);
router.get('/cart',isAuth,  shopController.getCart);
router.get('/product', isAuth, shopController.getProduct);
router.get('/buyNow/:id', isAuth, shopController.getBuyNow);
router.get('/product/:id', shopController.details);


router.post('/removeFromCart', shopController.removeFromCart)
router.post('/cart',isAuth, shopController.addToCart)
router.post('/admin', shopController.postAdminProd);
router.post('/postNewAddress',isAuth, shopController.postNewAddress)
router.post('/deleteItem/:prodId', shopController.postDeleteProduct);
router.post('/editPage', shopController.postEditPage);
router.post('/editProfile', shopController.postEditProfile);
router.post('/addToWishlist',isAuth, shopController.addToWishlist);
router.post('/removeFromWishlist', shopController.removeFromwishlist);

module.exports = router


// module.exports = router;