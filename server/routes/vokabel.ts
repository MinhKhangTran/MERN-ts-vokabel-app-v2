// Routes
import express from "express";
const router = express.Router();

import {
  getVoks,
  createVok,
  updateVok,
  deleteVok,
  getVok,
} from "../controllers/vokabel";

router.route("/").get(getVoks).post(createVok);
router.route("/:id").get(getVok).put(updateVok).delete(deleteVok);

export default router;
