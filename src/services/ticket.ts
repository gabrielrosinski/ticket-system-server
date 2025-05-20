import { ticketRepository } from "../database/repositories/tickets.js";
import { Ticket } from "../types/ticket.js";


class TicketServices {
    public async create(ticket: Ticket) {
        return await ticketRepository.create({...ticket});
    }

    public async getAllTickets(userId: number, clientId: number, status: string, page: number) {
        return await ticketRepository.getAllTickets(userId, clientId, status, page);
    }

    public async delete(ticketId: number) {
        return await ticketRepository.delete(ticketId);
    }
}

export const ticketServices = new TicketServices();