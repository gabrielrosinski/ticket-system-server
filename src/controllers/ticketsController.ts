import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/index.js";
import { ticketRepository } from "../database/repositories/tickets.js";
import { Ticket } from "../types/ticket.js";
import { userServices } from "../services/user.js";



class TicketsController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
          const ticketData =  req.body as Ticket;
          if(!ticketData) {
            throw new HttpError(400, "Could not create ticket");
          }
          
          await ticketRepository.create(ticketData);
    
          return res.status(200).json("Ticket was created");
        } catch (e) {
          next(e);
        }
    }

    public async getAllTickets(req: Request, res: Response, next: NextFunction) {
      try {
        // All parameters are optional in this case.
        const userId = Number(req.query.userId);
        const clientId = Number(req.query.clientId);
        const status = req.query.status?.toString();
        const page = Number(req.query.page);

        const tickets = await ticketRepository.getAllTickets(userId, clientId, status, page);
  
        return res.status(200).json({ tickets });
      } catch (e) {
        next(e);
      }
    }

    public async closeTicket(req: Request, res: Response, next: NextFunction) {
      try {
        const ticketId = Number(req.body.id);
        const closeReport = req.body.closeReport?.toString();
        const closeReason = req.body.closeReason?.toString();

        const user = userServices.getUserFromRequest(req);

        const closedBy = (await user).displayName;

        if(!ticketId || isNaN(ticketId)) {
          throw new HttpError(400, "Invalid ticket ID");
        }

        await ticketRepository.closeTicket(ticketId, closeReport, closeReason, closedBy);
  
        return res.status(200).json("Ticket was closed");
      } catch (e) {
        next(e);
      }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        const ticketId = Number(req.query.ticketId);

        if(!ticketId || isNaN(ticketId)) {
          throw new HttpError(400, "Invalid ticket ID");
        }

        await ticketRepository.delete(ticketId);
  
        return res.status(200).json("Ticket was deleted");
      } catch (e) {
        next(e);
      }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        const ticketData =  req.body as Ticket;
        if(!ticketData || !ticketData.id || Object.keys(ticketData).length === 1) {
          throw new HttpError(400, "Invalid ticket data");
        }

        await ticketRepository.updateTicketById(ticketData);
  
        return res.status(200).json("Ticket was updated");
      } catch (e) {
        next(e);
      }
    }
}

export const ticketsController = new TicketsController();