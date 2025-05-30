import { Router } from "express";
import agentController from "../controllers/agentController.js";


const agentRouter = Router()

agentRouter.post('/', agentController.searchAgent)

export default agentRouter