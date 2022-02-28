import { NextFunction, Request, Response } from "express";
import {userModel} from '../schemas/userModel'

export function checkDuplicateUsernameOrEmail(req: Request, res: Response, next: NextFunction){
  // Username
  userModel.findOne({
    username: req.body.username
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
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!["user", "admin", "moderator"].includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};