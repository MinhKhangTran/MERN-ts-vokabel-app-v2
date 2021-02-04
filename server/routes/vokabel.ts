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
} from "../controllers/vokabel";
import Vokabel from "../models/Vokabel";

router
  .route("/")
  .get(advancedResults(Vokabel), getVoks)
  .post(
    [
      check("deutsch", "Bitte deutsches Wort hinzufügen").not().isEmpty(),
      check("koreanisch", "Bitte koreanisches Wort hinzufügen").not().isEmpty(),
    ],
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
    updateVok
  )
  .delete(deleteVok);

export default router;
