import { Router } from "express";
import { authMiddleware, commonMiddleware } from "../middleware/index.js";
import { ticketsController } from "../controllers/ticketsController.js";
import { UserValidator } from "../validators/userValidator.js";


const router = Router();

router.post("/createTicket",
authMiddleware.checkToken,
//  commonMiddleware.bodyValid(TicketValidator.registerUser), // TODO: create validator for Tickets
ticketsController.create);

router.put("/closeTicket",
authMiddleware.checkToken,
ticketsController.closeTicket);

router.get("/getAllTickets/:clientId?/:userId?/:status?",
authMiddleware.checkToken,
ticketsController.getAllTickets);

router.delete("/deleteTicket/",
authMiddleware.checkToken,
ticketsController.delete);

router.put("/updateTicket/",
authMiddleware.checkToken,
ticketsController.update);


export default router;