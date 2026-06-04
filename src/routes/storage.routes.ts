import { Router } from 'express';
import { getPreSignedUrl } from '../controllers/storage.controller';
import { isAuthenticatedGuard } from '../middleware/auth.guard';

const router = Router();

// Enforce authentication check for all storage asset actions
router.use(isAuthenticatedGuard);

router.post('/presign', getPreSignedUrl);

export default router;