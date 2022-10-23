import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const userUpdate = async ({ id, username, name }: { id: string; username: string; name: string }) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
    }
    user.username = username;
    user.name = name;
    try {
      await userRepository.save(user);
    } catch (err) {
      throw new CustomError(409, 'Raw', `User '${user.email}' can't be saved.`, null, err);
    }
  } catch (e) {
    throw e.constructor && e.constructor.name === 'CustomError' ? e : new CustomError(400, 'Raw', 'Error', null, e);
  }
};

export const userDelete = async (id: string) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CustomError(404, 'General', 'Not Found', [`User with id:${id} doesn't exists.`]);
    }
    userRepository.delete(id);
    return user;
  } catch (e) {
    throw e.constructor && e.constructor.name === 'CustomError' ? e : new CustomError(400, 'Raw', 'Error', null, e);
  }
};
