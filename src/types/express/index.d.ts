declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        publicId: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
