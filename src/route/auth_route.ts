import express, { RequestHandler } from 'express';
import { signIn, signUp, sendVerificationCode, verifyVerificationCode } from "../controller/auth_controller" 
import { Router } from 'express';

const authRouter: Router = express.Router();

authRouter.post('/signIn', signIn as RequestHandler);
authRouter.post('/signUp', signUp as RequestHandler);
authRouter.post('/sendVerificationCode', sendVerificationCode);
authRouter.post('/verifyVerificationCode', verifyVerificationCode);

export default authRouter;