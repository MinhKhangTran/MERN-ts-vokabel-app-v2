// Routes
import express from "express";
const router = express.Router();
import { check } from "express-validator";
import advancedResults from "../middlewares/advancedResults";

import {
  getVoks,
  createVok,
  updateVok,
  deleteVok,
  getVok,
  toggleLike,
  getLikedVoks,
} from "../controllers/vokabel";
import Vokabel from "../models/Vokabel";
import { protect } from "../middlewares/auth";

router
  .route("/")
  .get(advancedResults(Vokabel), getVoks)
  .post(
    [
      check("deutsch", "Bitte deutsches Wort hinzufügen").not().isEmpty(),
      check("koreanisch", "Bitte koreanisches Wort hinzufügen").not().isEmpty(),
    ],
    protect,
    createVok
  );
router
  .route("/:id")
  .get(getVok)
  .put(
    [
      check("deutsch", "Bitte deutsches Wort hinzufügen").not().isEmpty(),
      check("koreanisch", "Bitte koreanisches Wort hinzufügen").not().isEmpty(),
    ],
    protect,
    updateVok
  )
  .delete(protect, deleteVok);
router.route("/:id/liked").put(protect, toggleLike);
router.route("/me/:id").get(protect, getLikedVoks);

export default router;
