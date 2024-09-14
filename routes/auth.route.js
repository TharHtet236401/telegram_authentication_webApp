import express from "express";
import { saveUser, getUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/save-user", saveUser);
router.get("/get-user/:userId", getUser);
export default router;