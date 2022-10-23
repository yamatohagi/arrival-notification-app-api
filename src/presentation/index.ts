import { Router } from 'express';

import auth from 'presentation/handler/auth';
import users from 'presentation/handler/users';

import page404 from '../middleware/pages/404';
import pageRoot from '../middleware/pages/root';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);

router.use(pageRoot);
router.use(page404);

export default router;
