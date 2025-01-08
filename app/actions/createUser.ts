"use server";

import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";
import { State } from "../types";

async function createUser(state: State, formData: FormData): Promise<State> {
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirm-password"));

    if (!name || !password || !email) {
        return {
            error: "Please fill in all fields",
        };
    }

    if (password.length < 8) {
        return {
            error: "Password must be at least 8 characters",
        };
    }

    if (password !== confirmPassword) {
      return {
        error: 'Passwords do not match'
      }
    }

    //Get account instance
    const {account} = await createAdminClient();

    try {
      //Create user
      await account.create(ID.unique(), email, password, name);

      return {
        success: true
      }
    } catch (error) {
      console.log('Registration error:', error);
      return {
        error: 'Could not register user'
      }
    }
}

export default createUser;
