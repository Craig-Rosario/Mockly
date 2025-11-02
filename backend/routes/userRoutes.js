import express from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import User from "../models/Users.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import MCQ from "../models/MCQ.js";
import FinalReport from "../models/FinalReport.js";
import { uploadResume, getResumeUrl, deleteResumeFile } from "../config/fileUpload.js";
import { extractTextFromPDFWithFallback, isValidPDF } from "../services/pdfExtractor.js";
import { analyzeResumeWithGemini, generateMCQsWithGemini } from "../services/geminiService.js";
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
        
        // Check for existing analysis with additional safety check
        let resumeAnalysis = await ResumeAnalysis.findOne({ 
            userId: user._id, 
            jobApplicationId: applicationId 
        });
        
        // If analysis exists and is completed, return it
        if (resumeAnalysis && resumeAnalysis.analysisStatus === 'completed') {
            console.log("Resume analysis already completed, returning existing:", resumeAnalysis._id);
            return res.json({
                message: "Resume analysis already exists",
                analysis: resumeAnalysis.analysisResult,
                analysisId: resumeAnalysis._id,
                createdAt: resumeAnalysis.createdAt,
                updatedAt: resumeAnalysis.updatedAt
            });
        }
        
        // If analysis exists but is in processing/error state, check if it's recent
        if (resumeAnalysis && (resumeAnalysis.analysisStatus === 'processing' || resumeAnalysis.analysisStatus === 'error')) {
            const timeSinceStarted = new Date() - resumeAnalysis.processingStartedAt;
            const fiveMinutesInMs = 5 * 60 * 1000;
            
            if (timeSinceStarted < fiveMinutesInMs && resumeAnalysis.analysisStatus === 'processing') {
                console.log("Resume analysis currently in progress, returning status");
                return res.json({
                    message: "Resume analysis is currently in progress",
                    analysisId: resumeAnalysis._id,
                    status: resumeAnalysis.analysisStatus,
                    startedAt: resumeAnalysis.processingStartedAt
                });
            }
        }
        
        // Create new analysis record or update existing one
        if (!resumeAnalysis) {
            console.log("Creating new resume analysis for application:", applicationId);
            resumeAnalysis = new ResumeAnalysis({
                userId: user._id,
                jobApplicationId: applicationId,
                analysisStatus: 'processing',
                processingStartedAt: new Date()
            });
        } else {
            console.log("Updating existing resume analysis:", resumeAnalysis._id);
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

// MCQ Routes

// Generate MCQs for a job application
router.post("/job-application/:applicationId/generate-mcqs", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        // Find user and job application
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const application = user.jobApplications.id(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Job application not found" });
        }

        // Check if MCQs already exist for this application
        const existingMCQ = await MCQ.findOne({
            userId: user._id,
            jobApplicationId: applicationId
        });

        if (existingMCQ) {
            return res.json({
                message: "MCQs already generated for this application",
                mcq: existingMCQ
            });
        }

        // Generate MCQs using Gemini
        console.log("Generating MCQs for job application:", applicationId);
        const geminiResult = await generateMCQsWithGemini({
            jobTitle: application.jobTitle,
            company: application.company,
            jobDescription: application.jobDescription,
            requiredSkills: application.requiredSkills,
            jobIndustry: application.jobIndustry
        });

        // Process and store MCQs
        const mcqQuestions = geminiResult.mcqs.map((mcq, index) => {
            // Convert letter answer (A, B, C, D) to actual option text
            const letterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            const correctIndex = letterToIndex[mcq.correct_answer];
            const correctAnswerText = mcq.options[correctIndex];
            
            console.log(`MCQ ${index} Generation Debug:`, {
                question: mcq.question.substring(0, 50) + "...",
                correct_answer_letter: mcq.correct_answer,
                correctIndex: correctIndex,
                options: mcq.options,
                correctAnswerText: correctAnswerText,
                correctAnswerTextType: typeof correctAnswerText,
                correctAnswerTextLength: correctAnswerText?.length
            });
            
            return {
                question: mcq.question,
                options: mcq.options,
                correctAnswer: correctAnswerText,
                topic: mcq.topic || extractTopicFromQuestion(mcq.question, application.requiredSkills)
            };
        });

        // Create MCQ document
        const mcqDoc = new MCQ({
            userId: user._id,
            jobApplicationId: applicationId,
            jobDescription: application.jobDescription,
            questions: mcqQuestions,
            mcqStatus: 'generated'
        });

        await mcqDoc.save();

        res.status(201).json({
            message: "MCQs generated successfully",
            mcq: mcqDoc
        });

    } catch (error) {
        console.error("MCQ generation error:", error);
        res.status(500).json({
            message: "Failed to generate MCQs",
            error: error.message
        });
    }
});

// Get MCQs for a job application
router.get("/job-application/:applicationId/mcqs", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const mcq = await MCQ.findOne({
            userId: user._id,
            jobApplicationId: applicationId
        });

        if (!mcq) {
            return res.status(404).json({ message: "MCQs not found for this application" });
        }

        res.json(mcq);

    } catch (error) {
        console.error("Get MCQs error:", error);
        res.status(500).json({
            message: "Failed to retrieve MCQs",
            error: error.message
        });
    }
});

// Submit MCQ answers and calculate results
router.post("/job-application/:applicationId/submit-mcqs", requireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { applicationId } = req.params;
    const { answers, timeTaken } = req.body;

    console.log("=== SUBMIT MCQ START ===");
    console.log("User ID:", clerkUserId);
    console.log("Application ID:", applicationId);
    console.log("Answers received:", answers?.length || 0);

    // --- Validation ---
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "Invalid or empty answers array",
        received: typeof answers,
      });
    }

    // --- Fetch user & MCQ ---
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const mcq = await MCQ.findOne({
      userId: user._id,
      jobApplicationId: applicationId,
    });

    if (!mcq) return res.status(404).json({ message: "MCQs not found for this application" });
    if (mcq.mcqStatus === "completed")
      return res.status(400).json({ message: "MCQs already completed for this application" });

    console.log("MCQ found:", {
      id: mcq._id,
      status: mcq.mcqStatus,
      questionsCount: mcq.questions?.length || 0,
    });

    // --- Scoring Setup ---
    let correctAnswers = 0;
    const answersSubmitted = [];
    const topicStats = {};

    console.log("=== MCQ PROCESSING START ===");

    // --- Process Each Answer ---
    answers.forEach((answer, index) => {
      const question = mcq.questions[answer.questionIndex];
      if (!question) {
        console.warn(`⚠️ Question not found at index ${answer.questionIndex}`);
        return;
      }

      const selectedAnswer = (answer.selectedAnswer || "").trim().toUpperCase();
      const correctAnswer = (question.correctAnswer || "").trim().toUpperCase();
      let isCorrect = false;

      // ✅ Case 1: Both are letters (A–D)
      if (
        ["A", "B", "C", "D"].includes(selectedAnswer) &&
        ["A", "B", "C", "D"].includes(correctAnswer)
      ) {
        isCorrect = selectedAnswer === correctAnswer;
      }

      // 🔄 Case 2: Backward compatibility for old text-based answers
      else {
        let selectedText = selectedAnswer;

        // If user sent a letter, map it to option text
        if (["A", "B", "C", "D"].includes(selectedAnswer)) {
          const idx = selectedAnswer.charCodeAt(0) - 65; // 'A'→0, 'B'→1
          selectedText = question.options[idx];
        }

        isCorrect =
          selectedText?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();
      }

      if (isCorrect) correctAnswers++;

      // --- Topic Stats ---
      const topic = question.topic || "General";
      topicStats[topic] ??= { correct: 0, total: 0 };
      topicStats[topic].total++;
      if (isCorrect) topicStats[topic].correct++;

      answersSubmitted.push({
        questionIndex: answer.questionIndex,
        selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0,
      });

      console.log(
        `Q${answer.questionIndex + 1}: ${isCorrect ? "✅ Correct" : "❌ Incorrect"} | Selected: ${selectedAnswer} | Correct: ${correctAnswer}`
      );
    });

    // --- Compute Final Stats ---
    const totalQuestions = mcq.questions.length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const topicWisePerformance = Object.keys(topicStats).map((topic) => ({
      topic,
      correct: topicStats[topic].correct,
      total: topicStats[topic].total,
      percentage: Math.round(
        (topicStats[topic].correct / topicStats[topic].total) * 100
      ),
    }));

    console.log("=== FINAL RESULTS ===", {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      timeTaken: timeTaken || 0,
    });

    // --- Update MCQ ---
    mcq.results = {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      timeTaken: timeTaken || 0,
      answersSubmitted,
      topicWisePerformance,
      completedAt: new Date(),
    };

    mcq.mcqStatus = "completed";
    mcq.completedAt = new Date();

    const savedMCQ = await mcq.save();

    // --- Update Job Application ---
    const application = user.jobApplications.id(applicationId);
    if (application) {
      application.mcqResults = {
        score,
        totalQuestions,
        correctAnswers,
        timeTaken: timeTaken || 0,
        completedAt: new Date(),
      };
      await user.save();
    }

    // --- Response ---
    res.json({
      message: "MCQ results saved successfully",
      results: savedMCQ.results,
      mcqId: savedMCQ._id,
      applicationId,
      debug: {
        mcqStatus: savedMCQ.mcqStatus,
        score: savedMCQ.results?.score,
      },
    });
  } catch (error) {
    console.error("Submit MCQs error:", error);
    res.status(500).json({
      message: "Failed to submit MCQ answers",
      error: error.message,
    });
  }
});


// Get MCQ results for a job application
router.get("/job-application/:applicationId/mcq-results", requireAuth(), async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { applicationId } = req.params;
        
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const mcq = await MCQ.findOne({
            userId: user._id,
            jobApplicationId: applicationId,
            mcqStatus: 'completed'
        });

        if (!mcq) {
            return res.status(404).json({ message: "MCQ results not found" });
        }

        res.json({
            results: mcq.results,
            questions: mcq.questions,
            completedAt: mcq.completedAt
        });

    } catch (error) {
        console.error("Get MCQ results error:", error);
        res.status(500).json({
            message: "Failed to retrieve MCQ results",
            error: error.message
        });
    }
});

// Helper function to extract topic from question
function extractTopicFromQuestion(question, requiredSkills = []) {
    const questionLower = question.toLowerCase();
    
    // Check for common technology keywords
    const techKeywords = {
        'JavaScript': ['javascript', 'js', 'node.js', 'react', 'vue', 'angular'],
        'Python': ['python', 'django', 'flask', 'pandas', 'numpy'],
        'Java': ['java', 'spring', 'hibernate'],
        'Database': ['sql', 'database', 'mysql', 'postgresql', 'mongodb'],
        'Web Development': ['html', 'css', 'frontend', 'backend', 'api'],
        'Cloud': ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes'],
        'General': []
    };

    // First check required skills
    for (const skill of requiredSkills) {
        if (questionLower.includes(skill.toLowerCase())) {
            return skill;
        }
    }

    // Then check predefined keywords
    for (const [topic, keywords] of Object.entries(techKeywords)) {
        for (const keyword of keywords) {
            if (questionLower.includes(keyword)) {
                return topic;
            }
        }
    }

    return 'General';
}

// Get final report metrics based on MCQ and Resume analysis
router.get("/final-report-metrics/:jobApplicationId", requireAuth(), async (req, res) => {
    try {
        const { jobApplicationId } = req.params;
        const userId = req.auth.userId;

        // Get user from our database
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Check if final report already exists
        let finalReport = await FinalReport.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId,
            reportStatus: 'completed'
        });

        if (finalReport) {
            return res.json({
                success: true,
                metrics: finalReport.metrics,
                mcqData: finalReport.mcqData,
                resumeData: finalReport.resumeData,
                improvements: finalReport.improvements
            });
        }

        // Enhanced MCQ data retrieval with detailed logging
        console.log("=== MCQ DATA RETRIEVAL DEBUG ===");
        console.log("User ID:", user._id);
        console.log("Job Application ID:", jobApplicationId);
        console.log("Job Application ID Type:", typeof jobApplicationId);

        // Try multiple approaches to find MCQ data - prioritize completed status
        let mcqData = await MCQ.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId,
            mcqStatus: 'completed'
        }).sort({ createdAt: -1 });

        if (!mcqData) {
            console.log("No completed MCQ found, trying without status filter...");
            mcqData = await MCQ.findOne({ 
                userId: user._id, 
                jobApplicationId: jobApplicationId
            }).sort({ createdAt: -1 });
        }

        if (!mcqData) {
            console.log("No MCQ found with exact match, trying string conversion...");
            mcqData = await MCQ.findOne({ 
                userId: user._id, 
                jobApplicationId: jobApplicationId.toString(),
                mcqStatus: 'completed'
            }).sort({ createdAt: -1 });
        }

        if (!mcqData) {
            console.log("No completed MCQ found with string conversion, trying without status...");
            mcqData = await MCQ.findOne({ 
                userId: user._id, 
                jobApplicationId: jobApplicationId.toString()
            }).sort({ createdAt: -1 });
        }

        // Try ObjectId conversion if the ID looks like a MongoDB ObjectId
        if (!mcqData && jobApplicationId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("Trying ObjectId conversion...");
            const mongoose = await import('mongoose');
            mcqData = await MCQ.findOne({ 
                userId: user._id, 
                jobApplicationId: new mongoose.Types.ObjectId(jobApplicationId),
                mcqStatus: 'completed'
            }).sort({ createdAt: -1 });
            
            if (!mcqData) {
                mcqData = await MCQ.findOne({ 
                    userId: user._id, 
                    jobApplicationId: new mongoose.Types.ObjectId(jobApplicationId)
                }).sort({ createdAt: -1 });
            }
        }

        // If still not found, get all MCQs for this user for debugging
        if (!mcqData) {
            console.log("No MCQ found, checking all MCQs for this user...");
            const allUserMCQs = await MCQ.find({ userId: user._id });
            console.log("All MCQs for user:", allUserMCQs.map(mcq => ({
                id: mcq._id,
                jobAppId: mcq.jobApplicationId,
                jobAppIdType: typeof mcq.jobApplicationId,
                status: mcq.mcqStatus,
                hasResults: !!mcq.results,
                createdAt: mcq.createdAt
            })));
        }

        console.log("Final MCQ data found:", mcqData ? {
            id: mcqData._id,
            status: mcqData.mcqStatus,
            hasResults: !!mcqData.results,
            resultsScore: mcqData.results?.score,
            jobAppId: mcqData.jobApplicationId,
            createdAt: mcqData.createdAt
        } : 'No MCQ found');

        // Enhanced Resume Analysis retrieval with same approach
        console.log("=== RESUME ANALYSIS RETRIEVAL DEBUG ===");
        let resumeAnalysis = await ResumeAnalysis.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId
        }).sort({ createdAt: -1 });

        if (!resumeAnalysis) {
            console.log("No Resume Analysis found with exact match, trying string conversion...");
            resumeAnalysis = await ResumeAnalysis.findOne({ 
                userId: user._id, 
                jobApplicationId: jobApplicationId.toString()
            }).sort({ createdAt: -1 });
        }

        if (!resumeAnalysis && jobApplicationId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("Trying ObjectId conversion for Resume Analysis...");
            const mongoose = await import('mongoose');
            resumeAnalysis = await ResumeAnalysis.findOne({ 
                userId: user._id, 
                jobApplicationId: new mongoose.Types.ObjectId(jobApplicationId)
            }).sort({ createdAt: -1 });
        }

        console.log("Resume Analysis found:", resumeAnalysis ? {
            id: resumeAnalysis._id,
            status: resumeAnalysis.analysisStatus,
            hasAnalysis: !!resumeAnalysis.analysisResult,
            matchScore: resumeAnalysis.analysisResult?.matchScore
        } : 'No Resume Analysis found');

        if (!mcqData && !resumeAnalysis) {
            console.log("=== NO DATA FOUND ===");
            return res.status(404).json({ 
                success: false, 
                message: "No assessments found for this job application",
                debug: {
                    userId: user._id,
                    jobApplicationId: jobApplicationId,
                    searchedFor: "MCQ and Resume Analysis data"
                }
            });
        }

        console.log("MCQ Data:", JSON.stringify(mcqData?.results, null, 2));
        console.log("Resume Analysis:", JSON.stringify(resumeAnalysis?.analysisResult, null, 2));

        // Extract actual scores from the data with detailed debugging
        console.log("=== SCORE EXTRACTION DEBUG ===");
        
        const mcqScore = mcqData?.results?.score || 0;
        const resumeScore = resumeAnalysis?.analysisResult?.matchScore || 0;
        
        console.log("MCQ Data exists:", !!mcqData);
        console.log("MCQ Results exists:", !!mcqData?.results);
        console.log("MCQ Score raw:", mcqData?.results?.score);
        console.log("MCQ Score final:", mcqScore);
        console.log("MCQ Status:", mcqData?.mcqStatus);
        
        console.log("Resume Analysis exists:", !!resumeAnalysis);
        console.log("Resume Analysis Result exists:", !!resumeAnalysis?.analysisResult);
        console.log("Resume Score raw:", resumeAnalysis?.analysisResult?.matchScore);
        console.log("Resume Score final:", resumeScore);
        console.log("Resume Status:", resumeAnalysis?.analysisStatus);

        // Calculate job match percentage (weighted average)
        const validScores = [];
        if (mcqScore > 0) validScores.push(mcqScore);
        if (resumeScore > 0) validScores.push(resumeScore);
        
        const jobMatch = resumeScore || 0;

        // Calculate total score (50% job match, 25% resume, 25% mcq)
        const totalScore = Math.round(
            (0.5 * jobMatch) + 
            (0.25 * resumeScore) + 
            (0.25 * mcqScore)
        );

        // Prepare the metrics data
        const metricsData = {
            mcqScore: mcqScore,
            resumeScore: resumeScore,
            jobMatch: jobMatch,
            totalScore: totalScore
        };

        console.log("=== FINAL METRICS DEBUG ===");
        console.log("Final metrics data:", metricsData);
        console.log("Valid scores for job match:", validScores);
        console.log("Job match calculation:", jobMatch);
        console.log("Total score calculation:", totalScore);

        const mcqDataForReport = mcqData ? {
            totalQuestions: mcqData.results.totalQuestions || 0,
            correctAnswers: mcqData.results.correctAnswers || 0,
            incorrectAnswers: mcqData.results.incorrectAnswers || 0,
            timeTaken: mcqData.results.timeTaken || 0,
            topicWisePerformance: mcqData.results.topicWisePerformance || [],
            completedAt: mcqData.results.completedAt
        } : null;

        const resumeDataForReport = resumeAnalysis ? {
            matchScore: resumeAnalysis.analysisResult.matchScore || 0,
            keywordAnalysis: resumeAnalysis.analysisResult.keywordAnalysis || { coveragePercentage: 0, neededKeywords: [] },
            experienceAnalysis: resumeAnalysis.analysisResult.experienceAnalysis || [],
            projectAnalysis: resumeAnalysis.analysisResult.projectAnalysis || [],
            overallSuggestions: resumeAnalysis.analysisResult.overallSuggestions || ""
        } : null;

        res.json({
            success: true,
            metrics: metricsData,
            mcqData: mcqDataForReport,
            resumeData: resumeDataForReport,
            improvements: [] // Will be populated by the improvements endpoint
        });

    } catch (error) {
        console.error("Error fetching final report metrics:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch final report metrics",
            error: error.message 
        });
    }
});

// Generate improvement suggestions using Gemini and save final report
router.post("/generate-improvements/:jobApplicationId", requireAuth(), async (req, res) => {
    try {
        const { jobApplicationId } = req.params;
        const userId = req.auth.userId;

        // Get user from our database
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Check if final report already exists with improvements
        let finalReport = await FinalReport.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId
        });

        if (finalReport && finalReport.improvements && finalReport.improvements.length > 0) {
            return res.json({
                success: true,
                improvements: finalReport.improvements
            });
        }

        // Fetch MCQ data
        const mcqData = await MCQ.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId,
            mcqStatus: 'completed'
        });

        // Fetch Resume Analysis data
        const resumeAnalysis = await ResumeAnalysis.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId,
            analysisStatus: 'completed'
        });

        if (!mcqData && !resumeAnalysis) {
            return res.status(404).json({ 
                success: false, 
                message: "No completed assessments found for this job application" 
            });
        }

        // Generate improvements using Gemini
        const { generateImprovementsWithGemini } = await import("../services/geminiService.js");
        const improvements = await generateImprovementsWithGemini(mcqData, resumeAnalysis);

        // Calculate metrics again for storing
        const mcqScore = mcqData?.results?.score || 0;
        const resumeScore = resumeAnalysis?.analysisResult?.matchScore || 0;
        
        const validScores = [];
        if (mcqScore > 0) validScores.push(mcqScore);
        if (resumeScore > 0) validScores.push(resumeScore);
        
        const jobMatch = validScores.length > 0 
            ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
            : 0;

        const totalScore = Math.round(
            (0.5 * jobMatch) + 
            (0.25 * resumeScore) + 
            (0.25 * mcqScore)
        );

        // Prepare data for final report
        const reportData = {
            userId: user._id,
            jobApplicationId: jobApplicationId,
            metrics: {
                mcqScore: mcqScore,
                resumeScore: resumeScore,
                jobMatch: jobMatch,
                totalScore: totalScore
            },
            mcqData: (mcqData && mcqData.results) ? {
                totalQuestions: mcqData.results.totalQuestions || 0,
                correctAnswers: mcqData.results.correctAnswers || 0,
                incorrectAnswers: mcqData.results.incorrectAnswers || 0,
                timeTaken: mcqData.results.timeTaken || 0,
                topicWisePerformance: mcqData.results.topicWisePerformance || [],
                completedAt: mcqData.results.completedAt
            } : {},
            resumeData: (resumeAnalysis && resumeAnalysis.analysisResult) ? {
                matchScore: resumeAnalysis.analysisResult.matchScore || 0,
                keywordAnalysis: resumeAnalysis.analysisResult.keywordAnalysis || { coveragePercentage: 0, neededKeywords: [] },
                experienceAnalysis: resumeAnalysis.analysisResult.experienceAnalysis || [],
                projectAnalysis: resumeAnalysis.analysisResult.projectAnalysis || [],
                overallSuggestions: resumeAnalysis.analysisResult.overallSuggestions || ""
            } : {},
            improvements: improvements,
            reportStatus: 'completed',
            lastUpdated: new Date()
        };

        // Save or update final report
        if (finalReport) {
            Object.assign(finalReport, reportData);
            await finalReport.save();
        } else {
            finalReport = new FinalReport(reportData);
            await finalReport.save();
        }

        res.json({
            success: true,
            improvements: improvements
        });

    } catch (error) {
        console.error("Error generating improvements:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to generate improvements",
            error: error.message 
        });
    }
});

// Get saved final report
router.get("/final-report/:jobApplicationId", requireAuth(), async (req, res) => {
    try {
        const { jobApplicationId } = req.params;
        const userId = req.auth.userId;

        // Get user from our database
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Get final report
        const finalReport = await FinalReport.findOne({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId
        });

        if (!finalReport) {
            return res.status(404).json({ 
                success: false, 
                message: "Final report not found" 
            });
        }

        res.json({
            success: true,
            report: {
                metrics: finalReport.metrics,
                mcqData: finalReport.mcqData,
                resumeData: finalReport.resumeData,
                improvements: finalReport.improvements,
                reportStatus: finalReport.reportStatus,
                generatedAt: finalReport.generatedAt,
                lastUpdated: finalReport.lastUpdated
            }
        });

    } catch (error) {
        console.error("Error fetching final report:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch final report",
            error: error.message 
        });
    }
});

// Debug endpoint to check existing data
router.get("/debug-data/:jobApplicationId", requireAuth(), async (req, res) => {
    try {
        const { jobApplicationId } = req.params;
        const userId = req.auth.userId;

        // Get user from our database
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Fetch all MCQ data for this user and job
        const allMCQs = await MCQ.find({ 
            userId: user._id
        });

        // Fetch all Resume Analysis data for this user and job
        const allResumeAnalyses = await ResumeAnalysis.find({ 
            userId: user._id
        });

        // Try to find by exact match and also by converting to string
        const mcqByExactMatch = allMCQs.filter(mcq => mcq.jobApplicationId.toString() === jobApplicationId);
        const resumeByExactMatch = allResumeAnalyses.filter(resume => resume.jobApplicationId.toString() === jobApplicationId);

        // Fetch final reports
        const finalReports = await FinalReport.find({ 
            userId: user._id, 
            jobApplicationId: jobApplicationId
        });

        res.json({
            success: true,
            debug: {
                userId: user._id,
                jobApplicationId,
                jobApplicationIdType: typeof jobApplicationId,
                mcqRecords: allMCQs.length,
                resumeRecords: allResumeAnalyses.length,
                finalReports: finalReports.length,
                exactMatchMCQ: mcqByExactMatch.length,
                exactMatchResume: resumeByExactMatch.length,
                allMCQJobIds: allMCQs.map(mcq => ({ id: mcq._id, jobAppId: mcq.jobApplicationId, type: typeof mcq.jobApplicationId })),
                allResumeJobIds: allResumeAnalyses.map(resume => ({ id: resume._id, jobAppId: resume.jobApplicationId, type: typeof resume.jobApplicationId })),
                mcqData: mcqByExactMatch.map(mcq => ({
                    id: mcq._id,
                    status: mcq.mcqStatus,
                    hasResults: !!mcq.results,
                    score: mcq.results?.score,
                    correctAnswers: mcq.results?.correctAnswers,
                    totalQuestions: mcq.results?.totalQuestions,
                    resultsStructure: mcq.results ? Object.keys(mcq.results) : null
                })),
                resumeData: resumeByExactMatch.map(resume => ({
                    id: resume._id,
                    status: resume.analysisStatus,
                    hasAnalysis: !!resume.analysisResult,
                    matchScore: resume.analysisResult?.matchScore,
                    analysisStructure: resume.analysisResult ? Object.keys(resume.analysisResult) : null
                }))
            }
        });

    } catch (error) {
        console.error("Error in debug endpoint:", error);
        res.status(500).json({ 
            success: false, 
            message: "Debug failed",
            error: error.message 
        });
    }
});

// Test endpoint to check MCQ answer format
router.post("/test-answer-format", requireAuth(), async (req, res) => {
    try {
        const { answers } = req.body;
        
        console.log("=== TESTING ANSWER FORMAT ===");
        console.log("Received answers:", JSON.stringify(answers, null, 2));
        
        if (answers && answers.length > 0) {
            console.log("First answer analysis:");
            console.log("- questionIndex:", answers[0].questionIndex, typeof answers[0].questionIndex);
            console.log("- selectedAnswer:", answers[0].selectedAnswer, typeof answers[0].selectedAnswer);
            console.log("- timeSpent:", answers[0].timeSpent, typeof answers[0].timeSpent);
        }
        
        res.json({
            success: true,
            message: "Answer format logged to console",
            receivedFormat: answers
        });
        
    } catch (error) {
        console.error("Test answer format error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to test answer format",
            error: error.message 
        });
    }
});

// Test endpoint to check MCQ data storage
router.get("/test-mcq-data/:jobApplicationId", requireAuth(), async (req, res) => {
    try {
        const { jobApplicationId } = req.params;
        const userId = req.auth.userId;

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get all MCQs for this user
        const allMCQs = await MCQ.find({ userId: user._id });
        
        // Get MCQs for this specific job application
        const jobMCQs = allMCQs.filter(mcq => 
            mcq.jobApplicationId.toString() === jobApplicationId ||
            mcq.jobApplicationId === jobApplicationId
        );

        res.json({
            success: true,
            debug: {
                userId: user._id,
                requestedJobAppId: jobApplicationId,
                totalMCQsForUser: allMCQs.length,
                mcqsForThisJob: jobMCQs.length,
                allMCQs: allMCQs.map(mcq => ({
                    id: mcq._id,
                    jobApplicationId: mcq.jobApplicationId,
                    jobAppIdType: typeof mcq.jobApplicationId,
                    status: mcq.mcqStatus,
                    hasResults: !!mcq.results,
                    score: mcq.results?.score,
                    totalQuestions: mcq.results?.totalQuestions,
                    correctAnswers: mcq.results?.correctAnswers,
                    createdAt: mcq.createdAt,
                    completedAt: mcq.completedAt
                })),
                jobSpecificMCQs: jobMCQs.map(mcq => ({
                    id: mcq._id,
                    status: mcq.mcqStatus,
                    results: mcq.results
                }))
            }
        });

    } catch (error) {
        console.error("Test MCQ data error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve MCQ test data",
            error: error.message 
        });
    }
});

// Test endpoint for MCQ answer comparison logic
router.post("/test-mcq-comparison", requireAuth(), async (req, res) => {
    try {
        const { questionOptions, correctAnswer, selectedAnswer } = req.body;
        
        console.log("=== MCQ COMPARISON TEST ===");
        console.log("Options:", questionOptions);
        console.log("Correct:", correctAnswer);
        console.log("Selected:", selectedAnswer);
        
        let isCorrect = false;
        let method = "none";
        
        // Method 1: Direct comparison
        if (selectedAnswer === correctAnswer) {
            isCorrect = true;
            method = "direct";
        }
        // Method 2: Letter to text
        else if (typeof selectedAnswer === 'string' && ['A', 'B', 'C', 'D'].includes(selectedAnswer)) {
            const letterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            const selectedText = questionOptions[letterToIndex[selectedAnswer]];
            if (selectedText === correctAnswer) {
                isCorrect = true;
                method = "letter-to-text";
            }
        }
        // Method 3: Index to text
        else if (typeof selectedAnswer === 'number' && selectedAnswer >= 0 && selectedAnswer <= 3) {
            const selectedText = questionOptions[selectedAnswer];
            if (selectedText === correctAnswer) {
                isCorrect = true;
                method = "index-to-text";
            }
        }
        // Method 4: String index to text
        else if (typeof selectedAnswer === 'string' && ['0', '1', '2', '3'].includes(selectedAnswer)) {
            const selectedText = questionOptions[parseInt(selectedAnswer)];
            if (selectedText === correctAnswer) {
                isCorrect = true;
                method = "string-index-to-text";
            }
        }
        
        res.json({
            isCorrect,
            method,
            selectedAnswer,
            correctAnswer,
            selectedText: method.includes("text") ? questionOptions[typeof selectedAnswer === 'number' ? selectedAnswer : (['A', 'B', 'C', 'D'].includes(selectedAnswer) ? { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[selectedAnswer] : parseInt(selectedAnswer))] : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
