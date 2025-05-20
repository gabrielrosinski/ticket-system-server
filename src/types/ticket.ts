
type Priority = "low" | "medium" | "high" | "critical";
type Status = "open" | "assigned" | "processing" | "closed"; 
type ProblemType = "internet" | "telephony" | "data_link" | "colocation" | "hosting" | "email" | "other";

interface CloseTicketReport {
    id: number;
    ticketId: number;
    comment: string;
    closeReason: string;
    closedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Ticket {
    id: number;
    clientId: number;
    clientName: string;
    title: string;
    description: string;
    priority: Priority;
    assignedUserId: number;
    assignedUserName: string;
    problemType: ProblemType;
    status: Status;
    closeTicketReports: CloseTicketReport[];
    createdAt: Date;
    updatedAt: Date;
}
  
export { Ticket };
  