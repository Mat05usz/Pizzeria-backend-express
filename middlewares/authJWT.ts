import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { userModel, roleModel } from "../schemas/userModel";
import { verifyJWT } from "../utils/utilsJWT";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers["x-access-token"] as string;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    let decodedJWT = await verifyJWT(token, process.env.JWT_SECRET!);

    if (!decodedJWT || typeof decodedJWT == "string") throw "JWT is undefined!";

    req.body.userId = decodedJWT.id;
    console.log(decodedJWT);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: "Unauthorized!" });
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userModel.findById(req.body.userId).exec();
    const roles = await roleModel
      .find({
        _id: { $in: user!.role },
      })
      .exec();

    for (let role of roles) {
      if (role.name === "admin") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;
  } catch (err) {
    console.error(err);
  }
}
export async function isModerator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userModel.findById(req.body.userId).exec();
    const roles = await roleModel
      .find({
        _id: { $in: user!.role },
      })
      .exec();

    for (let role of roles) {
      if (role.name === "moderator") {
        next();
        return;
      }
    }

    res.status(403).send({ message: "Require Moderator Role!" });
    return;
  } catch (err) {
    console.error(err);
  }
}
