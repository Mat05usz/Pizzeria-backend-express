import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel, roleModel } from "../schemas/userModel";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers["x-access-token"] as string;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.body.userId = decoded.id;
    next();
  });
}



export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  /*try {
    const user = await userModel.findById(req.body.userId).exec();
    const roles = await roleModel.find({
      _id: { $in: user!.role },
    }).exec();
    for (let role of roles) {
      if (role.name === "admin") {
        next();
      }
    }
  } catch (err) {
    console.error(err);
  }*/


  userModel.findById(req.body.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    roleModel.find(
      {
        _id: { $in: user!.role },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
}
export function isModerator(req: Request, res: Response, next: NextFunction) {
  userModel.findById(req.body.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    roleModel.find(
      {
        _id: { $in: user!.role },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
}
