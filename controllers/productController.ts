import { NextFunction, Request, Response } from "express";
import { Product } from "../Interfaces/ProductInterfaces";
import { productModel } from "../schemas/productModel";
import util from "util";
import fs from "fs";

export async function saveProduct(req: Request, res: Response) {
  if (!req.file) {
    throw new Error("An image must be provided!");
  }

  let product: Product = {
    name: req.body.productName,
    price: req.body.productPrice,
    description: req.body.productDescription,
    category: req.body.productCategory || "dummyCategory",
    image: req.file.path,
  };

  try {
    let newProduct = await productModel.create(product);
    await newProduct.save();
    res.sendStatus(201);
  } catch (err: any) {
    res.statusMessage = err.toString();
    res.status(400).end();
  }
}

export async function getProductsByCategory(req: Request, res: Response) {
  try {
    const responseObjects = await getItemsFromDatabase({
      category: req.params.category,
    });
    res.json(responseObjects);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const responseObjects = await getItemsFromDatabase();

    res.json(responseObjects);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
}

export async function deleteAllProducts(req: Request, res: Response) {
  try {
    await productModel.remove({}, () => {
      console.log("Collection cleared.");
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
}

export async function getProductByName(req: Request, res: Response) {
  try {
    const responseObject = await getItemsFromDatabase({
      category: req.params.category,
      name: req.params.name,
    });

    res.json(responseObject);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
}

async function getItemsFromDatabase(
  queryOptions: { category?: string; name?: string } = {}
): Promise<Product[]> {
  const readFile = util.promisify(fs.readFile);

  async function handleResponse(product: Product) {
    const imageBuffer = await readFile(product.image);
    const responseObject: Product = {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: imageBuffer.toString("base64"),
    };
    return responseObject;
  }

  const products = await productModel.find(queryOptions);

  return Promise.all<Product>(products.map(handleResponse));
}
