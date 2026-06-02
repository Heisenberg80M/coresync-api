import { Request, Response } from 'express';
import { prisma } from '../config/db';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * @route   POST /api/v1/sync/products
 * @desc    Upsert (Sync) a product item. If SKU exists, update it. If not, create it.
 * @access  Protected
 */
export const syncProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Defensive Check: Halt immediately if req.body is completely missing or blank
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Malformed request payload. Ensure body is sent as structured JSON data.'
      });
      return;
    }

    const { sku, name, description, price, inventory } = req.body;

    if (!userId) {
       res.status(401).json({ success: false, message: 'Unauthorized system access mapping context.' });
       return;
    }

    if (!sku || !name || price === undefined) {
       res.status(400).json({ success: false, message: 'Missing critical attributes: sku, name, and price are mandatory.' });
       return;
    }

    const parsedPrice = parseFloat(price) || 0.0;
    const parsedInventory = parseInt(inventory, 10) || 0;

    const syncedProduct = await prisma.product.upsert({
      where: { sku },
      update: {
        name,
        description,
        price: parsedPrice,
        inventory: parsedInventory,
      },
      create: {
        sku,
        name,
        description,
        price: parsedPrice,
        inventory: parsedInventory,
        userId, 
      },
    });

    res.status(200).json({
      success: true,
      message: 'Product engine catalog successfully synchronized.',
      product: syncedProduct,
    });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ success: false, message: 'Database transactional failure during sync lifecycle.' });
  }
};

/**
 * @route   GET /api/v1/sync/products
 * @desc    Retrieve all synchronized records belonging ONLY to the authenticated user session
 * @access  Protected
 */
export const getMySyncedProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ success: false, message: 'Unauthorized profile execution scope.' });
       return;
    }

    // Retrieve only the items mapped to this user's unique primary key
    const products = await prisma.product.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Fetch Sync Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving record indexes from infrastructure data pools.' });
  }
};