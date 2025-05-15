import { serve } from "inngest/next";
import {
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion
} from "@/config/inngest";

export const { GET, POST } = serve("Quickcart Inngest Functions", [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion
]);
