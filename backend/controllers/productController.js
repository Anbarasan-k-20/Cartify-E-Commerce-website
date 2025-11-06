import Product from "../models/Product.js";
// Get all products
export const getAllProducts = async (req, res) => {
  try {
    //    const query = {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Create new product
export const createProduct = async (req, res, next) => {
  try {
    const { title, price, description, category, rating } = req.body;
    // Validate required fields
    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description, and category are required",
      });
    }

    if (!title || !price || !description || !category)
      return next(new Error("Enter all the fields"));

    const product = await Product.create({
      title,
      price: parseFloat(price),
      description,
      category,
      rating: {
        rate: rating?.rate ? parseFloat(rating.rate) : 0,
        count: rating?.count ? parseInt(rating.count) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// export const deleteProduct = async(req,res,next) =>{
//   const {id} = req.params

//   try{

//   }
//   catch(err){

//   }
// }
