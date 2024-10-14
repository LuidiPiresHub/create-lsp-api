import { Request, Response } from 'express';
import userService from '@services/user.service';
import { mapStatus } from '@utils/mapStatus';

const getUsers = async (_req: Request, res: Response): Promise<Response> => {
  const { type, message } = await userService.getUsers();
  return res.status(mapStatus(type)).json({ message });
};

const getUserById = async (req: Request, res: Response): Promise<Response> => {
  const { params: { id } } = req;
  const { type, message } = await userService.getUserById(Number(id));
  return res.status(mapStatus(type)).json({ message });
};

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  const { type, message } = await userService.createUser(body);
  return res.status(mapStatus(type)).json({ message });
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { body, params: { id } } = req;
  const { type, message } = await userService.updateUser(Number(id), body);
  return res.status(mapStatus(type)).json({ message });
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { params: { id } } = req;
  const { type, message } = await userService.deleteUser(Number(id));
  return res.status(mapStatus(type)).json({ message });
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};