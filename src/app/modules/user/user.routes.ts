import express from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/check-auth";

const router = express.Router();

router.get("/:id", checkAuth, UserController.getSingleUserController);

export const UserRoutes = router;
