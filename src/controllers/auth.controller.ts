import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user / partner system
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1. Basic Payload Validation
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    // 2. Check if identity already exists in the system
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'A system profile with this email already exists.' });
      return;
    }

    // 3. Cryptographic Password Hashing (Salt rounds = 12 for enterprise safety)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Persistence to PostgreSQL database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    // 5. Respond successfully (Omit sending back the password hash)
    res.status(201).json({
      success: true,
      message: 'System profile registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Internal system error during registration flow.' });
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate credentials & return authorization token
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Input Check
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password keys.' });
      return;
    }

    // 2. Locate User Record
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Security Practice: Use vague messages to prevent account enumeration attacks
      res.status(401).json({ success: false, message: 'Invalid operational credentials provided.' });
      return;
    }

    // 3. Compare Input Password with Hashed Database string
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid operational credentials provided.' });
      return;
    }

    // 4. Sign a JSON Web Token (Expires in 24 hours)
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // 5. Expose Session Token to Client Gateway
    res.status(200).json({
      success: true,
      message: 'Authentication successful. Access session established.',
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal system error during authentication lifecycle.' });
  }
};