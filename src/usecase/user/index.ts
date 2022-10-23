import { Request, Response, NextFunction } from 'express';

import { userUpdate, userDelete } from 'domain/repository/user';
import { userListGet, userDetailGet } from 'usecase/user/queryService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = (req: Request, res: Response, next: NextFunction) =>
  userListGet()
    .then((result) => res.customSuccess(200, 'List of users.', result))
    .catch((e) => {
      const customError = new CustomError(400, 'Raw', `Can't retrieve list of users.`, null, e);
      return next(customError);
    });

export const show = (req: Request, res: Response, next: NextFunction) =>
  userDetailGet(req.params.id)
    .then((result) => res.customSuccess(200, 'User found', result))
    .catch((e) => next(e));

export const edit = async (req: Request, res: Response, next: NextFunction) =>
  userUpdate({ id: req.params.id, ...req.body })
    .then(() => {
      res.customSuccess(200, 'User successfully saved.');
    })
    .catch((e) => next(e));

export const destroy = async (req: Request, res: Response, next: NextFunction) =>
  userDelete(req.params.id)
    .then((user) => {
      res.customSuccess(200, 'User successfully deleted.', { id: user.id, name: user.name, email: user.email });
    })
    .catch((e) => next(e));
