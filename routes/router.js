import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes.js";

const router = Router()

router.use('/usuario', usuarioRoutes)

export default router;