import express from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import User from "../models/Users.js";
import { uploadResume, getResumeUrl, deleteResumeFile } from "../config/fileUpload.js";
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.post("/sync-user", requireAuth(), async (req, res) => {
    try {
        const clerkUser = await clerkClient.users.getUser(req.auth.userId);

        console.log("Syncing Clerk user:", clerkUser.emailAddresses[0].emailAddress);

        let user = await User.findOne({ clerkId: clerkUser.id });

        const userName = clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName 
            ? clerkUser.firstName
            : clerkUser.username 
            ? clerkUser.username
            : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] 
            ? clerkUser.emailAddresses[0].emailAddress.split("@")[0]
            : "User";

        if (!user) {
            user = await User.create({
                clerkId: clerkUser.id,
                name: userName,
                email: clerkUser.emailAddresses[0].emailAddress,
                location: clerkUser.publicMetadata?.location || '',
            });
            console.log("Created new user:", user.email, "with name:", user.name);
        } else {
            user.name = userName;
            user.email = clerkUser.emailAddresses[0].emailAddress;
            if (clerkUser.publicMetadata?.location) {
                user.location = clerkUser.publicMetadata.location;
            }
            await user.save();
            console.log("Updated existing user:", user.email, "with name:", user.name);
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

router.post("/job-application", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        console.log("Received job application data:", req.body);
        
        const user = await User.findOne({ clerkId: clerkUserId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.body.candidateName || !req.body.candidateEmail || !req.body.candidateLocation) {
            return res.status(400).json({ 
                error: "Personal details are required: candidateName, candidateEmail, candidateLocation" 
            });
        }

        if (!req.body.jobTitle || !req.body.company || !req.body.location) {
            return res.status(400).json({ 
                error: "Job details are required: jobTitle, company, location" 
            });
        }

        const jobApplication = {
            candidateName: req.body.candidateName,
            candidateEmail: req.body.candidateEmail,
            candidateLocation: req.body.candidateLocation,
            willingToRelocate: req.body.willingToRelocate || 'no',
            totalYOE: req.body.totalYOE || 0,
            primaryStack: req.body.primaryStack || [],
            
            resume: user.resume ? { ...user.resume.toObject() } : null,
            
            jobTitle: req.body.jobTitle,
            company: req.body.company,
            location: req.body.location,
            workMode: req.body.workMode || 'Remote',
            jobType: req.body.jobType || '',
            jobIndustry: req.body.jobIndustry || '',
            jobDescription: req.body.jobDescription || '',
            requiredSkills: req.body.requiredSkills || []
        };

        console.log("Processed job application:", jobApplication);

        console.log("Adding job application to user:", user.email);
        user.jobApplications.push(jobApplication);
        
        console.log("Saving user with job applications. Total count:", user.jobApplications.length);
        const savedUser = await user.save();
        console.log("User saved successfully. Job applications count:", savedUser.jobApplications.length);

        const newApplication = user.jobApplications[user.jobApplications.length - 1];
        console.log("New application created with ID:", newApplication._id);
        
        res.status(201).json({
            message: "Job application created successfully",
            application: newApplication,
            totalApplications: savedUser.jobApplications.length
        });
    } catch (err) {
        console.error("Job application creation error:", err);
        console.error("Error stack:", err.stack);
        res.status(500).json({ error: "Failed to create job application", details: err.message });
    }
});

router.get("/job-applications", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const user = await User.findOne({ clerkId: clerkUserId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.jobApplications);
    } catch (err) {
        console.error("Fetch job applications error:", err);
        res.status(500).json({ error: "Failed to fetch job applications" });
    }
});

router.get("/job-application/:applicationId", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        const user = await User.findOne({ clerkId: clerkUserId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const application = user.jobApplications.id(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }

        res.json(application);
    } catch (err) {
        console.error("Fetch job application error:", err);
        res.status(500).json({ error: "Failed to fetch job application" });
    }
});

router.patch("/job-application/:applicationId", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        const user = await User.findOne({ clerkId: clerkUserId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const application = user.jobApplications.id(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                application[key] = req.body[key];
            }
        });

        await user.save();
        
        res.json({
            message: "Job application updated successfully",
            application: application
        });
    } catch (err) {
        console.error("Update job application error:", err);
        res.status(500).json({ error: "Failed to update job application" });
    }
});

router.post("/test-job-application", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        console.log("Test route called by user:", clerkUserId);
        console.log("Test request body:", req.body);
        
        res.json({
            message: "Test route working",
            userId: clerkUserId,
            receivedData: req.body
        });
    } catch (err) {
        console.error("Test route error:", err);
        res.status(500).json({ error: "Test route failed" });
    }
});

router.get("/debug-applications", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const user = await User.findOne({ clerkId: clerkUserId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Debug: User has", user.jobApplications.length, "job applications");
        
        res.json({
            message: "Debug information",
            userId: clerkUserId,
            userEmail: user.email,
            totalApplications: user.jobApplications.length,
            applications: user.jobApplications,
            resume: user.resume || null,
            resumeHistoryCount: user.resumeHistory?.length || 0
        });
    } catch (err) {
        console.error("Debug route error:", err);
        res.status(500).json({ error: "Debug route failed" });
    }
});

router.post("/upload-resume", requireAuth(), (req, res) => {
    uploadResume(req, res, async (err) => {
        try {
            if (err) {
                console.error("Upload error:", err);
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const clerkUserId = req.auth.userId;
            const user = await User.findOne({ clerkId: clerkUserId });

            if (!user) {
                deleteResumeFile(req.file.filename);
                return res.status(404).json({ message: "User not found" });
            }

            const resumeData = {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                filePath: req.file.path,
                fileUrl: getResumeUrl(req.file.filename),
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                uploadedAt: new Date()
            };

            if (user.resume && user.resume.fileName) {
                deleteResumeFile(user.resume.fileName);
            }

            user.resume = resumeData;

            if (!user.resumeHistory) {
                user.resumeHistory = [];
            }
            user.resumeHistory.push(resumeData);

            await user.save();

            console.log("Resume uploaded successfully for user:", user.email);

            res.json({
                message: "Resume uploaded successfully",
                resume: resumeData
            });

        } catch (error) {
            console.error("Resume upload error:", error);
            if (req.file) {
                deleteResumeFile(req.file.filename);
            }
            res.status(500).json({ error: "Failed to save resume information" });
        }
    });
});

router.get("/resume", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resume) {
            return res.status(404).json({ message: "No resume found" });
        }

        res.json({
            message: "Resume retrieved successfully",
            resume: user.resume
        });
    } catch (err) {
        console.error("Get resume error:", err);
        res.status(500).json({ error: "Failed to retrieve resume" });
    }
});

router.get("/resume-history", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Resume history retrieved successfully",
            resumes: user.resumeHistory || []
        });
    } catch (err) {
        console.error("Get resume history error:", err);
        res.status(500).json({ error: "Failed to retrieve resume history" });
    }
});

router.delete("/resume", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resume) {
            return res.status(404).json({ message: "No resume found" });
        }

        const deleted = deleteResumeFile(user.resume.fileName);
        if (!deleted) {
            console.warn("Could not delete physical resume file:", user.resume.fileName);
        }

        user.resume = null;
        await user.save();

        res.json({
            message: "Resume deleted successfully"
        });
    } catch (err) {
        console.error("Delete resume error:", err);
        res.status(500).json({ error: "Failed to delete resume" });
    }
});

export default router;
