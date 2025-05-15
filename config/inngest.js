import { Inngest } from "inngest";
import dbConnect from "./db";
import User from "../models/User"; // Make sure you import your User model correctly

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", event: "clerk/user.created" },
  async ({ event }) => {
    const data = event.data;
    if (!data) throw new Error("Event data is missing");

    const { id, first_name, last_name, email_addresses, image_url } = data;
    const userData = {
      _id: id,
      name: first_name+' '+last_name,
      email: email_addresses[0]?.email_address,
      imageUrl: image_url,
    };

    await dbConnect();
    await User.create(userData);
  }
);

// Inngest function to update user data in the database
export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk", event: "clerk/user.updated" },
  async ({ event }) => {
    const data = event.data;
    if (!data) throw new Error("Event data is missing");

    const { id, first_name, last_name, email_addresses, image_url } = data;
    const userData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0]?.email_address,
      imageUrl: image_url,
    };

    await dbConnect();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk", event: "clerk/user.deleted" },
  async ({ event }) => {
    const data = event.data;
    if (!data) throw new Error("Event data is missing");

    const { id } = data;
    await dbConnect();
    await User.findByIdAndDelete(id);
  }
);
