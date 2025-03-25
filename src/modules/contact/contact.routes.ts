import { Router } from 'express';
import { contactContainer } from '../../containers';
import { upload } from '../../middlewares/upload.middleware';
import { validateParam } from '../../middlewares/validateUUID.middleware';
import { cacheBirthdayContacts } from '../../middlewares/cache.middleware';
import { authenticate } from '../../middlewares/auth.middleware';

const contactRouter = Router();

contactRouter.get(
  '/birthday-people',
  cacheBirthdayContacts,
  contactContainer.getBirthdayContacts.bind(contactContainer)
);

contactRouter.get(
  '/location',
  contactContainer.findByLocation.bind(contactContainer)
);

contactRouter.post(
  '/',
  authenticate,
  upload.single('profileImage'),
  contactContainer.create.bind(contactContainer)
);

contactRouter.post(
  '/notify-congratulation-email',
  authenticate,
  contactContainer.notify.bind(contactContainer)
);

contactRouter
  .route('/:id')
  .get(validateParam('id'), contactContainer.showOne.bind(contactContainer))
  .patch(validateParam('id'), contactContainer.update.bind(contactContainer))
  .delete(validateParam('id'), contactContainer.destroy.bind(contactContainer));

contactRouter.patch(
  '/:id/restore',
  validateParam('id'),
  contactContainer.restore.bind(contactContainer)
);

contactRouter.get(
  '/search/:term',
  validateParam('term'),
  contactContainer.getOneContactByEmailOrPhone.bind(contactContainer)
);

contactRouter.patch(
  '/:id/profile-image',
  validateParam('id'),
  upload.single('profileImage'),
  contactContainer.updateProfileImage.bind(contactContainer)
);

export default contactRouter;
