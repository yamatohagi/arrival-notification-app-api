import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const authInsert = async ({
  email,
  password,
  username,
  name,
}: {
  email: string;
  password: string;
  username: string;
  name: string;
}) => {
  {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOne({ where: { email } });

      if (user) {
        throw new CustomError(400, 'General', 'User already exists', [`Email '${user.email}' already exists`]);
      }
      try {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        newUser.name = name;
        newUser.hashPassword();
        await userRepository.save(newUser);
      } catch (err) {
        throw new CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
      }
    } catch (e) {
      throw e.constructor && e.constructor.name === 'CustomError' ? e : new CustomError(400, 'Raw', 'Error', null, e);
    }
  }
};

export const passwordUpdate = async ({
  id,
  name,
  password,
  passwordNew,
}: {
  id: string;
  name: string;
  password: string;
  passwordNew: string;
}) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CustomError(404, 'General', 'Not Found', [`User ${name} not found.`]);
    }

    if (!user.checkIfPasswordMatch(password)) {
      throw new CustomError(400, 'General', 'Not Found', ['Incorrect password']);
    }

    user.password = passwordNew;
    user.hashPassword();
    userRepository.save(user);
  } catch (e) {
    throw e.constructor && e.constructor.name === 'CustomError' ? e : new CustomError(400, 'Raw', 'Error', null, e);
  }
};
