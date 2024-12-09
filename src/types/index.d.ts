import { Role } from '@common/enums/Role';
import { User as PrismaUser, UserProfile } from '@prisma/client';

export declare global {
  namespace Express {
    interface User extends Omit<PrismaUser, 'password'> {
      userProfile?: UserProfile;
    }
    interface Request {
      user?: User;
    }
  }
}

declare module 'jsonwebtoken' {
  export declare interface CustomPayload {
    id: string;
    email: string;
    username: string;
    loginAt?: number;
    role?: Role;
  }
  export declare interface JwtPayload extends CustomPayload {}
  // declare interface CustomPayload extends jwt.JwtPayload {
  //   role: Role;
  // }
}

declare module 'express' {
  interface Request {
    verify?: JwtPayload;
    token?: string;
  }
}
