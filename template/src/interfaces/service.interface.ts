import { HttpStatus } from '@utils/mapStatus';

export interface IService<T> {
  type: keyof typeof HttpStatus;
  message: T;
}