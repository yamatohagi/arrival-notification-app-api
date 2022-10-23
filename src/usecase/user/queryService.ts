import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const userListGet = () =>
  getRepository(User).find({
    select: ['id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'],
  });

export const userDetailGet = async (id: string) => {
  try {
    const user = await getRepository(User).findOne(id, {
      select: ['id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'],
    });
    if (!user) {
      const customError = new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
      throw customError;
    }
    return user;
  } catch (e) {
    throw e.constructor && e.constructor.name === 'CustomError' ? e : new CustomError(400, 'Raw', 'Error', null, e);
  }
};
