import express from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import User from "../models/Users.js";

const router = express.Router();

router.post("/sync-user", requireAuth(), async (req, res) => {
    try {
        const clerkUser = await clerkClient.users.getUser(req.auth.userId);

        console.log("Syncing Clerk user:", clerkUser.emailAddresses[0].emailAddress);

        let user = await User.findOne({ clerkId: clerkUser.id });

        if (!user) {
            user = await User.create({
                clerkId: clerkUser.id,
                name:
                    clerkUser.username ||
                    clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
                    "User",

                email: clerkUser.emailAddresses[0].emailAddress,
            });
            console.log("Created new user:", user.email);
        } else {
            console.log("ℹUser already exists:", user.email);
        }

        res.json(user);
    } catch (err) {
        console.error("Sync error:", err);
        res.status(500).json({ error: "Failed to sync user" });
    }
});

router.get("/current-user", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

export default router;
