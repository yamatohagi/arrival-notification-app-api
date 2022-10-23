import { Request, Response, NextFunction } from 'express';

import { authInsert, passwordUpdate } from 'domain/repository/auth';
import { authUser } from 'usecase/auth/queryService';

export const login = async (req: Request, res: Response, next: NextFunction) =>
  authUser({ ...req.body })
    .then((result) => res.customSuccess(200, 'Token successfully created.', `Bearer ${result}`))
    .catch((e) => next(e));

export const register = async (req: Request, res: Response, next: NextFunction) =>
  authInsert({ ...req.body })
    .then(() => res.customSuccess(200, 'User successfully created.'))
    .catch((e) => next(e));

export const changePassword = async (req: Request, res: Response, next: NextFunction) =>
  passwordUpdate({ ...req.jwtPayload, ...req.body })
    .then(() => res.customSuccess(200, 'Password successfully changed.'))
    .catch((e) => next(e));
