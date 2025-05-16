import { clsx, type ClassValue } from "clsx";
import jwt from 'jsonwebtoken';
import { twMerge } from "tailwind-merge";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Verify JWT token
export const verifyJWT = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

// Format time (HH:MM)
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Get user info from token
export const getUserFromToken = async (token: string) => {
  try {
    const decoded = await verifyJWT(token);
    return {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};
