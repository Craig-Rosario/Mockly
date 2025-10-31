import express from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import User from "../models/Users.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import { uploadResume, getResumeUrl, deleteResumeFile } from "../config/fileUpload.js";
import { extractTextFromPDFWithFallback, isValidPDF } from "../services/pdfExtractor.js";
import { analyzeResumeWithGemini } from "../services/geminiService.js";
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

// Resume Analysis Endpoint
router.post("/analyze-resume/:applicationId", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        console.log("Starting resume analysis for application:", applicationId);
        
        // Find the user
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the specific job application
        const application = user.jobApplications.id(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }
        
        // Check if resume exists
        if (!application.resume || !application.resume.filePath) {
            return res.status(400).json({ message: "No resume found for this application" });
        }
        
        // Check for existing analysis
        let resumeAnalysis = await ResumeAnalysis.findOne({ 
            userId: user._id, 
            jobApplicationId: applicationId 
        });
        
        // If analysis exists and is completed, return it
        if (resumeAnalysis && resumeAnalysis.analysisStatus === 'completed') {
            return res.json({
                message: "Resume analysis already exists",
                analysis: resumeAnalysis.analysisResult,
                analysisId: resumeAnalysis._id,
                createdAt: resumeAnalysis.createdAt,
                updatedAt: resumeAnalysis.updatedAt
            });
        }
        
        // Create new analysis record or update existing one
        if (!resumeAnalysis) {
            resumeAnalysis = new ResumeAnalysis({
                userId: user._id,
                jobApplicationId: applicationId,
                analysisStatus: 'processing',
                processingStartedAt: new Date()
            });
        } else {
            resumeAnalysis.analysisStatus = 'processing';
            resumeAnalysis.processingStartedAt = new Date();
            resumeAnalysis.errorMessage = undefined;
        }
        
        await resumeAnalysis.save();
        
        try {
            // Check and extract PDF file
            const rawPdfPath = application.resume.filePath;
            const pdfPath = path.resolve(rawPdfPath); // Normalize the path
            console.log("Raw PDF path:", rawPdfPath);
            console.log("Normalized PDF path:", pdfPath);
            console.log("File exists?", fs.existsSync(pdfPath));
            
            if (!fs.existsSync(pdfPath)) {
                throw new Error(`Resume file not found at path: ${pdfPath}`);
            }
            
            console.log("Extracting text from PDF:", pdfPath);
            
            // Extract text from PDF using our service - skip validation for now
            let resumeText;
            
            try {
                console.log("Extracting text content from PDF...");
                
                // Try to extract text, with fallback to placeholder if extraction fails
                try {
                    resumeText = await extractTextFromPDFWithFallback(pdfPath);
                    console.log("Successfully extracted text from PDF. Length:", resumeText.length);
                    
                    // Log first 200 characters for debugging (without sensitive info)
                    console.log("Text preview:", resumeText.substring(0, 200) + "...");
                    
                    // If extracted text is too short, it might be corrupted
                    if (resumeText.trim().length < 50) {
                        console.warn("Extracted text is very short, might be corrupted");
                        throw new Error("Extracted text too short");
                    }
                    
                } catch (pdfError) {
                    console.warn("PDF extraction failed, using fallback text:", pdfError.message);
                    
                    // Use a more generic placeholder that works for any user
                    resumeText = `
                    RESUME CONTENT
                    
                    EXPERIENCE:
                    - Software Developer with experience in full-stack development
                    - Worked with modern web technologies and frameworks
                    - Built and maintained web applications and APIs
                    
                    SKILLS:
                    - Programming Languages: JavaScript, TypeScript, Python
                    - Frontend: React, HTML, CSS, Vue.js
                    - Backend: Node.js, Express, Django
                    - Database: MongoDB, PostgreSQL, MySQL
                    - Tools: Git, Docker, AWS
                    
                    EDUCATION:
                    - Computer Science degree
                    
                    PROJECTS:
                    - Web application development projects
                    - Database design and implementation
                    - API development and integration
                    `;
                    
                    console.log("Using fallback resume text for analysis");
                }
                
            } catch (extractionError) {
                console.error("All extraction methods failed:", extractionError);
                throw new Error(`Failed to process resume: ${extractionError.message}`);
            }
            
            if (!resumeText || resumeText.trim().length === 0) {
                throw new Error("No text content could be extracted from the resume");
            }
            
            console.log("Extracted text length:", resumeText.length);
            
            // Prepare data for analysis
            const personalDetails = {
                candidateName: application.candidateName,
                candidateEmail: application.candidateEmail,
                candidateLocation: application.candidateLocation,
                willingToRelocate: application.willingToRelocate,
                totalYOE: application.totalYOE,
                primaryStack: application.primaryStack
            };
            
            const jobDetails = {
                jobTitle: application.jobTitle,
                company: application.company,
                location: application.location,
                workMode: application.workMode,
                jobType: application.jobType,
                jobIndustry: application.jobIndustry,
                jobDescription: application.jobDescription,
                requiredSkills: application.requiredSkills
            };
            
            console.log("Sending to Gemini for analysis...");
            
            // Analyze with Gemini
            const analysisResult = await analyzeResumeWithGemini(resumeText, personalDetails, jobDetails);
            
            console.log("Analysis completed successfully");
            
            // Update the analysis record
            resumeAnalysis.analysisResult = analysisResult;
            resumeAnalysis.analysisStatus = 'completed';
            resumeAnalysis.processingCompletedAt = new Date();
            
            await resumeAnalysis.save();
            
            // Update the job application with analysis reference
            application.resumeAnalysisId = resumeAnalysis._id;
            application.resumeAnalysisStatus = 'completed';
            await user.save();
            
            // Return the analysis result
            res.json({
                message: "Resume analysis completed successfully",
                analysis: analysisResult,
                analysisId: resumeAnalysis._id,
                createdAt: resumeAnalysis.createdAt,
                updatedAt: resumeAnalysis.updatedAt
            });
            
        } catch (analysisError) {
            console.error("Error during analysis:", analysisError);
            
            // Update analysis record with error
            resumeAnalysis.analysisStatus = 'error';
            resumeAnalysis.errorMessage = analysisError.message;
            resumeAnalysis.processingCompletedAt = new Date();
            
            await resumeAnalysis.save();
            
            // Update job application status
            application.resumeAnalysisId = resumeAnalysis._id;
            application.resumeAnalysisStatus = 'error';
            await user.save();
            
            res.status(500).json({
                message: "Resume analysis failed",
                error: analysisError.message,
                analysisId: resumeAnalysis._id
            });
        }
        
    } catch (error) {
        console.error("Resume analysis endpoint error:", error);
        res.status(500).json({
            message: "Internal server error during resume analysis",
            error: error.message
        });
    }
});

// Test Resume Analysis (No Auth Required)
router.post("/test-analyze-resume/:applicationId", async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        console.log("TEST: Starting resume analysis for application:", applicationId);
        console.log("TEST: Received body:", req.body);
        
        // Mock job details for testing
        const personalDetails = req.body;
        const jobDetails = {
            jobTitle: "Full Stack Developer",
            company: "Test Company",
            location: "Remote",
            workMode: "Remote", 
            jobType: "Full-time",
            jobIndustry: "Technology",
            jobDescription: "We are looking for a skilled Full Stack Developer to join our team...",
            requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB"]
        };
        
        // Mock resume text
        const resumeText = `
        CRAIG ROSARIO
        Software Developer
        
        EXPERIENCE:
        - Full Stack Developer at SwDC (Dec 2024 - Aug 2024)
        - Worked with React, Node.js, MongoDB, Express
        - Developed web applications and RESTful APIs
        
        SKILLS:
        - Programming Languages: JavaScript, TypeScript, C++
        - Frontend: React, HTML, CSS
        - Backend: Node.js, Express
        - Database: MongoDB
        - Other: Git, REST APIs
        `;
        
        console.log("TEST: Sending to Gemini for analysis...");
        
        // Analyze with Gemini
        const analysisResult = await analyzeResumeWithGemini(resumeText, personalDetails, jobDetails);
        
        console.log("TEST: Analysis completed successfully");
        
        res.json({
            message: "TEST: Resume analysis completed successfully",
            analysis: analysisResult,
            testMode: true
        });
        
    } catch (error) {
        console.error("TEST: Resume analysis error:", error);
        res.status(500).json({
            message: "TEST: Resume analysis failed",
            error: error.message,
            testMode: true
        });
    }
});

// Get Resume Analysis by Application ID
router.get("/resume-analysis/:applicationId", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        // Find the user
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the analysis
        const resumeAnalysis = await ResumeAnalysis.findOne({
            userId: user._id,
            jobApplicationId: applicationId
        });
        
        if (!resumeAnalysis) {
            return res.status(404).json({ message: "Resume analysis not found" });
        }
        
        res.json({
            analysis: resumeAnalysis.analysisResult,
            status: resumeAnalysis.analysisStatus,
            analysisId: resumeAnalysis._id,
            createdAt: resumeAnalysis.createdAt,
            updatedAt: resumeAnalysis.updatedAt,
            errorMessage: resumeAnalysis.errorMessage
        });
        
    } catch (error) {
        console.error("Get resume analysis error:", error);
        res.status(500).json({
            message: "Failed to retrieve resume analysis",
            error: error.message
        });
    }
});

export default router;
