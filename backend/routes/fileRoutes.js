import express from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import User from '../models/Users.js';
import { base64ToBuffer, getFileExtensionFromBase64 } from '../config/fileUpload.js';

const router = express.Router();

router.get('/resume/:fileId', requireAuth(), async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = getAuth(req);
        
        // Find the user and their resume
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check if the file exists in user's resume or resume history
        let resumeFile = null;
        let fileName = null;
        
        // First check current resume
        if (user.resume && user.resume.fileName === fileId) {
            resumeFile = user.resume;
            fileName = user.resume.originalName || fileId;
        }
        
        // Then check resume history
        if (!resumeFile && user.resumeHistory) {
            const historyItem = user.resumeHistory.find(item => item.fileName === fileId);
            if (historyItem) {
                resumeFile = historyItem;
                fileName = historyItem.originalName || fileId;
            }
        }
        
        // Also check job applications for resume files
        if (!resumeFile) {
            for (const application of user.jobApplications) {
                if (application.resume && application.resume.fileName === fileId) {
                    resumeFile = application.resume;
                    fileName = application.resume.originalName || fileId;
                    break;
                }
            }
        }
        
        if (!resumeFile || !resumeFile.fileData) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        try {
            // Convert base64 to buffer
            const fileBuffer = base64ToBuffer(resumeFile.fileData);
            
            // Set appropriate headers
            const mimeType = resumeFile.mimeType || 'application/pdf';
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            res.setHeader('Content-Length', fileBuffer.length);
            
            // Send the file
            res.send(fileBuffer);
            
        } catch (conversionError) {
            console.error('Error converting base64 to buffer:', conversionError);
            res.status(500).json({ error: 'Error processing file data' });
        }

    } catch (error) {
        console.error('File serve error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check for file service
router.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        message: 'File service is running',
        timestamp: new Date().toISOString()
    });
});

export default router;