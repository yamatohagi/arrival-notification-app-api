import { getRepository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const authUser = async ({ email, password }: { email: string; password: string }) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
    }

    if (!user.checkIfPasswordMatch(password)) {
      throw new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
    }
    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      created_at: user.created_at,
    };

    try {
      const token = createJwtToken(jwtPayload);
      return token;
    } catch (err) {
      throw new CustomError(400, 'Raw', "Token can't be created", null, err);
    }
  } catch (e) {
    throw e.constructor && e.constructor.name === 'CustomError' ? e : new CustomError(400, 'Raw', 'Error', null, e);
  }
};
