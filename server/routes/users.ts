import express from "express";
const router = express.Router();
import { check } from "express-validator";
import advancedResults from "../middlewares/advancedResults";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getLikedList,
} from "../controllers/users";
import User from "../models/User";
import { protect, admin } from "../middlewares/auth";

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(
    [
      check("username", "Bitte Username hinzufügen").not().isEmpty(),
      check("password", "Bitte Password hinzufügen").not().isEmpty(),
      check("email", "Bitte Email hinzufügen").not().isEmpty().isEmail(),
    ],
    protect,
    admin,
    createUser
  );
router
  .route("/:id")
  .get(getUser)
  .put(
    [
      check("username", "Bitte Username hinzufügen").not().isEmpty(),
      check("email", "Bitte Email hinzufügen").not().isEmpty().isEmail(),
    ],
    protect,
    admin,
    updateUser
  )
  .delete(protect, admin, deleteUser);

router.route("/:id/liked").get(protect, getLikedList);

export default router;
