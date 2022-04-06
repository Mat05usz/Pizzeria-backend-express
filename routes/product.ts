import express from "express";
import multer from "multer";
import { deleteAllProducts, getAllProducts, getProductByName, getProductsByCategory, saveProduct } from "../controllers/productController";
import { verifyToken, isAdmin } from "../middlewares/authJWT";

export const productRouter = express.Router();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

productRouter.post(
  "/",
  multer({ storage: multerStorage }).single("productImage"),
  saveProduct
);

productRouter.get("/", getAllProducts);

productRouter.delete("/", [verifyToken, isAdmin], deleteAllProducts);

productRouter.get("/:category", getProductsByCategory);

productRouter.get("/:category/:name", getProductByName);