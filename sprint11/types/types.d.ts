import { FilteredUser } from "../src/services/userService.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Express.User | FilteredUser;
    }
  }
}
