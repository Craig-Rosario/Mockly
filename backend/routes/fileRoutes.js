import express from 'express';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.get('/resume/:filename', requireAuth(), (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const resolvedPath = path.resolve(filePath);
        const uploadsPath = path.resolve(path.join(process.cwd(), 'uploads', 'resumes'));
        
        if (!resolvedPath.startsWith(uploadsPath)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error reading file' });
            }
        });

    } catch (error) {
        console.error('File serve error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;