import db from "../connect.js";
import { Ticket } from "../../types/ticket.js";

class TicketRepository {
    /**
     * Creates a new ticket in the database.
     * @param ticket The ticket to create, must have all fields except id.
     * @returns The created ticket with the id field populated.
     */
    public async create(ticket: Ticket) {
        return (
            await db.query(
            `
            INSERT INTO tickets (client_id, title, description, priority, status, assigned_user_id, problem_type) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;      
            `,
            [ticket.clientId, ticket.title, ticket.description, ticket.priority, ticket.status, ticket.assignedUserId, ticket.problemType],
            )
        ).rows[0] as Ticket;
    }


    /**
     * Retrieves all tickets from the database ordered by creation time in descending order (newest first).
     * @returns An array of Ticket objects.
     */
    public async getAllTickets(userId: number, clientId: number, status?: string, page: number = 0): Promise<Ticket[]> {

        const offsetPage = Number(page) || 0; 
        const _userId = Number.isInteger(userId) ? userId : null;
        const _clientId = Number.isInteger(clientId) ? clientId : null;
        const _status = status ? status.toLowerCase() : null;

        const query = `
                        SELECT 
                        tickets.id, 
                        clients.id AS "clientId",
                        clients.name AS "clientName",
                        tickets.title, 
                        tickets.description, 
                        tickets.priority, 
                        tickets.status, 
                        tickets.assigned_user_id AS "assignedUserId",
                        users.username AS "assignedUserName",  
                        tickets.problem_type AS "problemType", 
                        tickets.created_at AS "createdAt", 
                        tickets.updated_at AS "updatedAt",
                         (
                            SELECT json_build_object(
                                'id', close_ticket_reports.id,
                                'closeReport', close_ticket_reports.close_report,
                                'closeReason', close_ticket_reports.close_reason,
                                'closedBy', close_ticket_reports.closed_by,
                                'createdAt', close_ticket_reports.created_at
                            )
                            FROM close_ticket_reports
                            WHERE close_ticket_reports.ticket_id = tickets.id
                        ) AS "closeTicketReport"
                        FROM tickets
                        LEFT JOIN clients ON tickets.client_id = clients.id
                        LEFT JOIN users ON tickets.assigned_user_id = users.id
                        WHERE (tickets.client_id = $1 OR $1 IS NULL)
                        AND (tickets.status = $2 OR $2 IS NULL)
                        AND (tickets.assigned_user_id = $3 OR $3 IS NULL)
                        ORDER BY tickets.created_at DESC
                        LIMIT 10 OFFSET $4;
        `;
        
        return (await db.query(query, [_clientId, _status, _userId, offsetPage])).rows as Ticket[];
    }

    /**
     * Deletes a ticket from the database.
     * @param ticketId The id of the ticket to delete.
     * @returns A result object from the database query.
     */
    public async delete(ticketId: number) {
        const _ticketId = Number.isInteger(ticketId) ? ticketId : null;
        const query = `DELETE FROM tickets WHERE id = ${_ticketId}`;
        const s = await db.query(query);
    }

    /**
     * Updates an existing ticket in the database with the provided fields.
     * If a field value is an empty string, it will not update that field.
     * 
     * @param ticket The ticket object containing updated information. 
     *               The ticket object must contain a valid id.
     * @returns A promise that resolves when the update operation is complete.
     */
    public async updateTicketById(ticket: Ticket) {
        const _ticketId = Number.isInteger(ticket.id) ? ticket.id : null;

        const query = 
                `UPDATE tickets
                SET 
                    title = COALESCE(NULLIF($1, ''), title),
                    description = COALESCE(NULLIF($2, ''), description),
                    priority = COALESCE(NULLIF($3, ''), priority),
                    status = COALESCE(NULLIF($4, ''), status),
                    problem_type = COALESCE(NULLIF($5, ''), problem_type),
                    assigned_user_id = COALESCE(NULLIF($6, '')::INTEGER, assigned_user_id)
                WHERE id = ${_ticketId};`

        await db.query(query, [ticket.title, ticket.description, ticket.priority, ticket.status, ticket.problemType, ticket.assignedUserId]);
    }

    public async closeTicket(id: number, closeReport: string, closeReason: string, closedBy: string) {
        try {
            await db.query('BEGIN');
    
            const updateReportQuery = `
                INSERT INTO close_ticket_reports (close_report, close_reason, closed_by, ticket_id) 
                VALUES ($1, $2, $3, $4)
            `;
            
            const reportResult = await db.query(updateReportQuery, [closeReport, closeReason, closedBy, id]);

            // Check if any rows were updated in close_ticket_reports
            if (reportResult.rowCount === 0) {
                throw new Error(`No ticket found with id = ${id}`);
            }

            const updateTicketQuery = `
                UPDATE tickets
                SET 
                    status = 'closed'
                WHERE id = $1
            `;
            
            const ticketResult = await db.query(updateTicketQuery, [id]);

            // Check if any rows were updated in tickets
            if (ticketResult.rowCount === 0) {
                throw new Error(`No ticket found with id = ${id}`);
            }
    
            await db.query('COMMIT');
        } catch (error) {
            await db.query('ROLLBACK');
            console.error('Error closing ticket:', error);
            throw error;
        }
    }
}


export const ticketRepository = new TicketRepository();
