import { Request, Response } from "express";
import { roleModel, userModel } from "../schemas/userModel";
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
import { User, Role } from "../Interfaces/UserInterfaces";

export async function signup(req: Request, res: Response) {
  try {
    let rolesFilter = {
      name:
        req.body.roles && //if there is something in roles and
        Array.isArray(req.body.roles) && //roles are a non empty array
        req.body.roles.length != 0
          ? { $in: req.body.roles } //pass in the roles, otherwise
          : "user", //just make it a regular 'user'
    };

    let roles = await roleModel.find(rolesFilter).exec();

    const salt = await bcrypt.genSaltSync(10);
    const password = await bcrypt.hash(req.body.password, salt);

    let user = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: password,
      role: roles,
    });

    await user.save();

    res.sendStatus(200);
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
}
export async function signin(req: Request, res: Response) {
  if (!req) res.sendStatus(400);

  try {
    let user = await userModel
      .findOne({
        username: req.body.username,
      })
      .populate("role", "-__v")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    let passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });
    var authorities = [];
    for (let i = 0; i < user.role.length; i++) {
      let role = user.role[i] as any;
      authorities.push("ROLE_" + role.name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.name,
      email: user.email,
      role: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}
