import express from "express";
import { getAllChampions } from "../controllers/champions.js";

// Route — maps a URL to a controller function
// import controller for custom items

const router = express.Router();

// define routes to get, create, edit, and delete items
router.get("/champions", getAllChampions);

export default router;
