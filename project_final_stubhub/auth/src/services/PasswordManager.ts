import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// scrypt is call back based, and to use asyn await we need to promisify
const scryptAsync = promisify(scrypt);

export class PasswordManager {
  static async toHash(password: string) {
    // 1:  generate salt
    const salt = randomBytes(8).toString("hex");

    // 2 generate buffer with scrypt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    const hash = `${buf.toString("hex")}.${salt}`;
    return hash;
  }

  /**
   * Compares the hash portion of the hashed password - ie excluding salt
   * @param storedPassword - hash comprising of hashed pwd + salt
   * @param suppliedPassword - string input from user
   */
  static async doesMatch(storedPassword: string, suppliedPassword: string) {
    const [hashed, salt] = storedPassword.split(".");

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashed;
  }
}
