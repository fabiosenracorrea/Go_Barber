import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ensureAuth from '../middlewares/ensureAuth';

import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService();

  const createdUser = await createUserService.execute({
    name,
    email,
    password,
  });

  delete createdUser.password;

  return response.status(201).json(createdUser);
});

usersRouter.patch(
  '/avatar',
  ensureAuth,
  upload.single('avatar'),
  async (request, response) => {
    const userAvatarService = new UpdateUserAvatarService();

    const userUpdated = await userAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete userUpdated.password;

    return response.status(200).json(userUpdated);
  },
);

export default usersRouter;
