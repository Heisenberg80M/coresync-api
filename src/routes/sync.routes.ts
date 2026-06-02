import { Router } from 'express';
// CRITICAL: Ensure curly braces wrap BOTH controller functions explicitly
import { syncProduct, getMySyncedProducts } from '../controllers/sync.controller';
import { isAuthenticatedGuard } from '../middleware/auth.guard';

const router = Router();

// Inject the guard middleware universally for all data sync routes
router.use(isAuthenticatedGuard);

router.post('/products', syncProduct);
router.get('/products', getMySyncedProducts); // Line 11 is now perfectly mapped!

export default router;