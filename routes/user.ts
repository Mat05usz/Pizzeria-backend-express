import { verifyToken, isAdmin, isModerator } from "../middlewares/authJWT";
import { signin, signup } from "../controllers/auth_controller";
import { allAccess, userBoard, moderatorBoard, adminBoard } from "../controllers/userController";
import express from "express";

export const userRouter = express.Router();

userRouter.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

userRouter.get("/test/all", allAccess);

userRouter.get("/test/user", [verifyToken], userBoard);

userRouter.get(
  "/test/mod",
  [verifyToken, isModerator],
  moderatorBoard
);

userRouter.get(
  "/test/admin",
  [verifyToken, isAdmin],
  adminBoard
);
