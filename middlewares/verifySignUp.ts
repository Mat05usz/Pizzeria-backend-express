import { NextFunction, Request, Response } from "express";
import { userModel } from "../schemas/userModel";

export async function checkDuplicateUsernameOrEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Username
  try {
    let user = await userModel
      .findOne({
        name: req.body.name,
      })
      .exec();

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    let email = await userModel
      .findOne({
        email: req.body.email,
      })
      .exec();

    if (email) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }

    next();
  } catch (err) {
    console.error(err);
  }
}

export function checkRolesExisted(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let roles = req.body.roles;
  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (!["user", "admin", "moderator"].includes(roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
}
