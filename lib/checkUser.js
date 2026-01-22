import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    // Use auth() first to check if user is authenticated
    // If middleware isn't detected, auth() will throw an error
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      // If auth fails (e.g., middleware not detected), return null silently
      // This prevents the app from crashing when middleware isn't properly configured
      return null;
    }
    
    if (!userId) {
      return null;
    }

    // Get full user details - only if we have userId
    let user;
    try {
      user = await currentUser();
    } catch (userError) {
      // If currentUser fails, return null
      return null;
    }
    
    if (!user) {
      return null;
    }

    try {
      const loggedInUser = await db.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
      });

      if (loggedInUser) {
        return loggedInUser;
      }

      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "User";

      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0]?.emailAddress || "",
        },
      });

      return newUser;
    } catch (dbError) {
      // If database connection fails, log but don't crash
      console.error("Database error in checkUser:", dbError.message);
      return null;
    }
  } catch (error) {
    // If auth fails, return null gracefully
    console.error("Auth error in checkUser:", error.message);
    return null;
  }
};
