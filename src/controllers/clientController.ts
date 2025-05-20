import { Request, Response, NextFunction } from "express";

import { HttpError } from "../errors/index.js";
import { clientRepository } from "../database/repositories/index.js";
import { Client } from "../types/client.js";
import { number } from "joi";

// import { Client } from "../types/client.js";  

class ClientController {
  public async getAll(req: Request, res: Response) {
    try {
      const clients = await clientRepository.getAllClients();
      return res.status(200).json(clients);
    } catch {
      throw new HttpError(
        500,
        "Internal Server Error: Failed to get all clients from database",
      );
    }
  }

  public async partialClientList(req: Request, res: Response) {
    try {
      const clients = await clientRepository.partialClientList();
      return res.status(200).json(clients);
    } catch {
      throw new HttpError(
        500,
        "Internal Server Error: Failed to get all clients from database",
      );
    }
  }

  public async createClient(req: Request, res: Response) {
    try {
      const client = req.body as Client;
      await clientRepository.createClient(client);
      return res.status(200).json("Client was created");
    } catch {
      throw new HttpError(
        500,
        "Internal Server Error: Failed to create client",
      );
    }
  }

  public async updateClient(req: Request, res: Response) {
    try {
      const client =  req.body as Client;
      if(!client || !client.id || Object.keys(client).length === 1) {
        throw new HttpError(400, "Invalid client data");
      }

      await clientRepository.updateClient(client);
      return res.status(200).json("Client was updated");
    } catch {
      throw new HttpError(
        500,
        "Internal Server Error: Failed to update client",
      );
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id = Number(req.query.id);

      if (isNaN(id)) {
        throw new HttpError(400, "Invalid client data");
      }

      await clientRepository.delete(id);
      return res.status(200).json("Client was successfully deleted");
    } catch {
      throw new HttpError(
        500,
        "Internal Server Error: Failed to delete client",
      );
    }
  }




  // public async search(req: Request, res: Response) {
  //   try {
  //     const clients = await clientRepository.getByNameOrParams(req.body.string);
  //     return res.status(200).json(clients);
  //   } catch {
  //     throw new HttpError(
  //       500,
  //       "Internal Server Error: Failed to search clients from database",
  //     );
  //   }
  // }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await clientRepository.getById(Number(req.params.id));
      if (!client) {
        throw new HttpError(404, "Client not found");
      }
      return res.status(200).json(client);
    } catch (e) {
      next(e);
    }
  }
}

export const clientController = new ClientController();
