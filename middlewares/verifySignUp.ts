import { NextFunction, Request, Response } from "express";
import {userModel} from '../schemas/userModel'

export function checkDuplicateUsernameOrEmail(req: Request, res: Response, next: NextFunction){
  // Username
  userModel.findOne({
    name: req.body.name
  }).exec((err: any, user: any) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    // Email
    userModel.findOne({
      email: req.body.email
    }).exec((err: any, user: any) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

export function checkRolesExisted(req: Request, res: Response, next: NextFunction){
  let roles = req.body.roles;
  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!["user", "admin", "moderator"].includes(roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};