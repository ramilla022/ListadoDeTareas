import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import tareaRoutes from "./tareaRoutes.js";

const router = Router()

router.use('/usuario', usuarioRoutes)
router.use('/tarea', tareaRoutes)

export default router;