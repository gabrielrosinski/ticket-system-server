import db from "../connect.js";
import { Client } from "../../types/index.js";
import { Contact, Service } from "../../types/client.js";

class ClientRepository {
  // public escapeLikePattern(input: string) {
  //   return input.replace(/[%_\\]/g, "\\$&"); // Adds escaping for \, %, _
  // }

  public async getAllClients(): Promise<Client[]> {

    const query = `
    SELECT 
        c.id AS id,
        c.name AS name,
        c.status AS status,
        c.side_note AS "sideNote",
        c.created_at AS "clientCreatedAt",
        c.updated_at AS "clientUpdatedAt",
        COALESCE((
            SELECT json_agg(
                json_build_object(
                    'serviceId', s.id,
                    'serviceType', s.service_type,
                    'technology', s.technology,
                    'speed', s.speed,
                    'address', s.address,
                    'fromAddress', s.from_address,
                    'toAddress', s.to_address,
                    'status', s.status,
                    'numberlessLines', s.numberless_lines,
                    'phoneNumbers', s.phone_numbers
                )
            )
            FROM services s
            WHERE s.client_id = c.id
        ), '[]') AS services,
        COALESCE((
            SELECT json_agg(
                json_build_object(
                    'id', ct.id,
                    'clientId', ct.client_id,
                    'type', ct.contact_type,
                    'name', ct.contact_name,
                    'value', ct.value
                )
            )
            FROM contacts ct
            WHERE ct.client_id = c.id
        ), '[]') AS contacts
    FROM 
        clients c;
`;
  
    try {
      const result = await db.query(query);
      return result.rows as Client[];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  public async partialClientList(): Promise<Client[]> {

    const query = `
                    SELECT 
                        c.id AS id,
                        c.name AS name
                    FROM 
                        clients c;
                  `;
  
    try {
      const result = await db.query(query);
      return result.rows as Client[];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }


  


  public async createClient(client: Client)  {
    const result = await db.query(
      `INSERT INTO clients (name, status, side_note) VALUES ($1, $2, $3) RETURNING id`,
      [client.name, client.status, client.sideNote]
    );

    const clientId = result.rows[0].id;

    await this.addServices(clientId, client.services);
    await this.addContacts(clientId, client.contacts);
  }

  async addServices(clientId: number, services: Service[]): Promise<void> {
    for (const service of services) {
      await db.query(
        ` INSERT INTO services (client_id, service_type, technology, speed, address, from_address, to_address, numberless_lines, phone_numbers) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [clientId, service.serviceType, service.technology, service.speed, service.address, service.fromAddress, service.toAddress, service.numberlessLines, service.phoneNumbers]
      );
    }
  }

  async addContacts(clientId: number, contacts: Contact[]): Promise<void> {
    for (const contact of contacts) {
      await db.query(
        `INSERT INTO contacts (client_id, contact_type, contact_name, value) VALUES ($1, $2, $3, $4)`,
        [clientId, contact.type, contact.name, contact.value]
      );
    }
  }

  async updateClient(client: Client): Promise<void> {
    const { id, name, status, sideNote, services, contacts } = client;
  
    try {
      await db.query('BEGIN');
  
      // Step 1: Update client details
      if (name || status || sideNote) {
        const updateQuery = `
          UPDATE clients
          SET 
            name = COALESCE($1, name),
            status = COALESCE($2, status),
            side_note = COALESCE($3, side_note),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
        `;
        await db.query(updateQuery, [name, status, sideNote, id]);
      }
  
      // Step 2: Handle services
      if (services) {
        // Delete existing services not in the input
        const existingServicesResult = await db.query(
          `SELECT id FROM services WHERE client_id = $1`,
          [id]
        );
        const existingServiceIds = existingServicesResult.rows.map((row) => row.id);
        const inputServiceIds = services.filter((s) => s.id).map((s) => s.id);
  
        const servicesToDelete = existingServiceIds.filter((id) => !inputServiceIds.includes(id));
        if (servicesToDelete.length > 0) {
          await db.query(`DELETE FROM services WHERE id = ANY($1)`, [servicesToDelete]);
        }
  
        // Insert or update services
        for (const service of services) {
          if (service.id) {
            // Update existing service
            await db.query(
              `UPDATE services SET
                service_type = $1,
                technology = $2,
                address = $3, 
                from_address = $4, 
                to_address = $5, 
                numberless_lines = $6, 
                phone_numbers = $7, 
                speed = $8, 
                status = $9  
              WHERE id = $10`,
              [service.serviceType, 
                service.technology, 
                service.address, 
                service.fromAddress, 
                service.toAddress, 
                service.numberlessLines, 
                service.phoneNumbers, 
                service.speed, 
                service.status, 
                service.id]
            );
          } else {
            // Insert new service
            await db.query(
              `INSERT INTO services (client_id, 
                service_type, 
                technology, 
                address, 
                from_address, 
                to_address, 
                numberless_lines, 
                phone_numbers, 
                speed, 
                status) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [id, service.serviceType, 
                service.technology, 
                service.address, 
                service.fromAddress, 
                service.toAddress, 
                service.numberlessLines, 
                service.phoneNumbers, 
                service.speed, 
                service.status]
            );
          }
        }
      }
  
      // Step 3: Handle contacts
      if (contacts) {
        // Delete existing contacts not in the input
        const existingContactsResult = await db.query(
          `SELECT id FROM contacts WHERE client_id = $1`,
          [id]
        );
        const existingContactIds = existingContactsResult.rows.map((row) => row.id);
        const inputContactIds = contacts.filter((c) => c.id).map((c) => c.id);
  
        const contactsToDelete = existingContactIds.filter((id) => !inputContactIds.includes(id));
        if (contactsToDelete.length > 0) {
          await db.query(`DELETE FROM contacts WHERE id = ANY($1)`, [contactsToDelete]);
        }
  
        // Insert or update contacts
        for (const contact of contacts) {
          if (contact.id) {
            // Update existing contact
            await db.query(
              `UPDATE contacts SET contact_type = $1, contact_name = $2, value = $3 WHERE id = $4`,
              [contact.type, contact.name, contact.value, contact.id]
            );
          } else {
            // Insert new contact
            await db.query(
              `INSERT INTO contacts (client_id, contact_type, contact_name, value) VALUES ($1, $2, $3, $4)`,
              [id, contact.type, contact.name, contact.value]
            );
          }
        }
      }
  
      await db.query('COMMIT');
      console.log(`Client with ID ${id} updated successfully.`);
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error updating client:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db.query('DELETE FROM clients WHERE id = $1', [id]);
      console.log(`Client with ID ${id} and all associated data deleted successfully.`);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  // public async getByNameOrParams(params: string) {
  //   const escapedParams = this.escapeLikePattern(params);
  //   return (
  //     await db.query(
  //       `SELECT * FROM clients WHERE name ILIKE $1 OR service_params ILIKE $1`,
  //       [`%${escapedParams}%`],
  //     )
  //   ).rows as Client[];
  // }

  public async getById(id: number) {
    const query = `
      SELECT 
        c.id AS id,
        c.name AS name,
        c.status AS status,
        c.side_note AS "sideNote",
        c.created_at AS "clientCreatedAt",
        c.updated_at AS "clientUpdatedAt",
        COALESCE((
          SELECT json_agg(s)
          FROM services s
          WHERE s.client_id = c.id
        ), '[]') AS services,
        COALESCE((
          SELECT json_agg(ct)
          FROM contacts ct
          WHERE ct.client_id = c.id
        ), '[]') AS contacts
      FROM 
        clients c
      WHERE c.id = $1;
    `;
    return (await db.query(query, [id]))
      .rows[0] as Client;
  }
}

export const clientRepository = new ClientRepository();
