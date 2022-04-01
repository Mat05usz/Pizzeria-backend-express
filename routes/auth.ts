import express from "express";
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignUp"
import { signin, signup } from "../controllers/auth_controller";


export const authRouter = express.Router();

authRouter.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

authRouter.post(
  "/signup",
  [checkDuplicateUsernameOrEmail, checkRolesExisted],
  signup
);

authRouter.post("/signin", signin);
