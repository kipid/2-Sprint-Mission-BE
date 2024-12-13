import { Express } from 'express';
import { FilteredUser } from '../src/services/userService'

declare global {
	namespace Express {
		interface Request {
			user: FilteredUser;
		}
	}
}