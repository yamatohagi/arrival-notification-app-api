import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
      return next(customError);
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
      res.customSuccess(200, 'Token successfully created.', `Bearer ${token}`);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, name } = req.body;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { email } });

    if (user) {
      const customError = new CustomError(400, 'General', 'User already exists', [
        `Email '${user.email}' already exists`,
      ]);
      return next(customError);
    }

    try {
      const newUser = new User();
      newUser.email = email;
      newUser.password = password;
      newUser.username = username;
      newUser.name = name;
      newUser.hashPassword();
      await userRepository.save(newUser);

      res.customSuccess(200, 'User successfully created.');
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordNew } = req.body;
  const { id, name } = req.jwtPayload;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', [`User ${name} not found.`]);
      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(400, 'General', 'Not Found', ['Incorrect password']);
      return next(customError);
    }

    user.password = passwordNew;
    user.hashPassword();
    userRepository.save(user);

    res.customSuccess(200, 'Password successfully changed.');
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
