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
} from "../controllers/users";
import User from "../models/User";

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(
    [
      check("username", "Bitte Username hinzufügen").not().isEmpty(),
      check("password", "Bitte Password hinzufügen").not().isEmpty(),
      check("email", "Bitte Email hinzufügen").not().isEmpty().isEmail(),
    ],
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
    updateUser
  )
  .delete(deleteUser);

export default router;
