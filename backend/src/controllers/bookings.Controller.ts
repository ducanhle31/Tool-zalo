import { Request, Response } from "express";
import { Booking } from "../models/booking.Model";

class BookingsController {
  public async get(req: Request, res: Response) {
    try {
      const data = await Booking.find();
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await Booking.findById(id);
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default new BookingsController();
