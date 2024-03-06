const productController = require("express").Router()
const Product = require("../Schema/Product")
// const verifyToken = require('../middleware/auth'

const verifyToken = require('../middleware/auth')
const cloudinary = require("./cloudinary");
const upload = require("./multer");
productController.get('/getAll', async (req, res) => {
    try {
        const products = await Product.find({})
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json(error)
    }
})
productController.post("/create",verifyToken, upload.single("image"),async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      let user = new Product({
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        category: req.body.category,
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
        
      });
      await user.save();
      res.json(user);
    } catch (err) {
      console.log(err);
    }
  });
productController.get('/find/:id', async (req, res) => {
    try {
        // const blog = await Blog.findById(req.params.id);
        const product = await Product.findById(req.params.id)
        // .populate("userId", '-password')
        // blog.views += 1
        // await blog.save()
        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json(error)
    }
})

productController.put("/updateproduct/:id", verifyToken, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,  req.body , { new: true })
        
        res.send(updatedProduct)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// productController.get('/featured', async (req, res) => {
//     try {
//         const blogs = await Blog.find({ featured: true }).populate("userId", '-password').limit(3)
//         return res.status(200).json(blogs)
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })

// productController.post('/', 
// // verifyToken,
//  async (req, res) => {
//     try {
//         const blog = await Blog.create({ ...req.body, userId: req.user.id })
//         return res.status(201).json(blog)
//     } catch (error) {
//         return res.status(500).json(error.message)
//     }
// })



// productController.put("/updateBlog/:id", verifyToken, async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id)
//         if (blog.userId.toString() !== req.user.id.toString()) {
//             throw new Error("You can update only your own posts")
//         }

//         const updatedBlog = await Blog
//             .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
//             .populate('userId', '-password')

//         return res.status(200).json(updatedBlog)
//     } catch (error) {
//         return res.status(500).json(error.message)
//     }
// })

// productController.put('/likeBlog/:id', verifyToken, async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id)
//         if(blog.likes.includes(req.user.id)){
//             blog.likes = blog.likes.filter((userId) => userId !== req.user.id)
//             await blog.save()

//             return res.status(200).json({msg: 'Successfully unliked the blog'})
//         } else {
//             blog.likes.push(req.user.id)
//             await blog.save()

//             return res.status(200).json({msg: "Successfully liked the blog"})
//         }

//     } catch (error) {
//         return res.status(500).json(error)
//     }
// })

productController.delete('/delete/:id',  async(req, res) => {
  try {
    const _id = req.params.id;
    const post = await Product.findByIdAndDelete(_id);
    res.send(post);
  } catch (error) {
    res.send(error);
  }
})

module.exports = productController