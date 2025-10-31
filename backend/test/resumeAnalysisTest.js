// Test script for Resume Analysis functionality
// Run with: node test/resumeAnalysisTest.js

import { analyzeResumeWithGemini } from '../services/geminiService.js';
import { extractTextFromPDFWithFallback, isValidPDF } from '../services/pdfExtractor.js';
import dotenv from 'dotenv';
dotenv.config();

// Test data
const samplePersonalDetails = {
  candidateName: "John Doe",
  candidateEmail: "john.doe@example.com", 
  candidateLocation: "New York, NY",
  willingToRelocate: "yes",
  totalYOE: 5,
  primaryStack: ["JavaScript", "React", "Node.js"]
};

const sampleJobDetails = {
  jobTitle: "Senior Full Stack Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  workMode: "Remote",
  jobType: "fulltime",
  jobIndustry: "technology",
  jobDescription: `We are looking for a Senior Full Stack Developer to join our growing team. 
  The ideal candidate will have 3+ years of experience with React, Node.js, and MongoDB.
  
  Responsibilities:
  - Develop and maintain web applications using React and Node.js
  - Work with MongoDB for database operations
  - Collaborate with cross-functional teams
  - Write clean, maintainable code
  - Participate in code reviews
  
  Requirements:
  - Bachelor's degree in Computer Science or related field
  - 3+ years of experience with JavaScript
  - Strong experience with React and Redux
  - Experience with Node.js and Express
  - Knowledge of MongoDB or similar NoSQL databases
  - Experience with Git version control
  - Strong problem-solving skills
  - Excellent communication skills`,
  requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript", "Express", "Git"]
};

const sampleResumeText = `
JOHN DOE
Senior Software Developer
Email: john.doe@example.com
Phone: (555) 123-4567
Location: New York, NY

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of experience building scalable web applications. 
Proficient in React, Node.js, and modern JavaScript frameworks. Strong background in database 
design and API development.

TECHNICAL SKILLS
- Programming Languages: JavaScript, TypeScript, Python
- Frontend: React, Redux, HTML5, CSS3, Sass
- Backend: Node.js, Express.js, Python Flask
- Databases: MongoDB, PostgreSQL, MySQL
- Tools: Git, Docker, AWS, Jest, Webpack

PROFESSIONAL EXPERIENCE

Senior Software Developer | TechSolutions Inc. | Jan 2022 - Present
- Led development of e-commerce platform serving 100K+ users
- Built RESTful APIs using Node.js and Express
- Implemented responsive UI components with React and Redux
- Optimized database queries reducing load times by 40%
- Mentored 3 junior developers

Software Developer | StartupXYZ | Jun 2019 - Dec 2021  
- Developed customer-facing web application using React
- Built backend services with Node.js and MongoDB
- Implemented user authentication and authorization
- Collaborated with design team to implement pixel-perfect UIs
- Participated in agile development process

Junior Developer | WebCorp | Jan 2018 - May 2019
- Built responsive websites using HTML, CSS, and JavaScript
- Maintained legacy PHP applications
- Assisted in database design and optimization
- Learned modern development practices and tools

PROJECTS

E-Commerce Platform (2022)
- Full-stack web application for online retail
- Technologies: React, Node.js, MongoDB, AWS
- Implemented shopping cart, payment integration, and admin dashboard
- Achieved 99.9% uptime with AWS deployment

Task Management App (2021) 
- Real-time collaboration tool for teams
- Technologies: React, Socket.io, Express, PostgreSQL
- Built real-time messaging and notification system
- Supports 1000+ concurrent users

EDUCATION
Bachelor of Science in Computer Science
New York University | 2014 - 2018

CERTIFICATIONS
- AWS Certified Solutions Architect (2022)
- MongoDB Certified Developer (2021)
`;

async function testResumeAnalysis() {
  console.log('🧪 Testing Resume Analysis System\n');
  
  try {
    console.log('1. Testing Gemini AI Integration...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY environment variable not set');
      return;
    }
    
    console.log('✅ Gemini API key found');
    
    // Test the analysis function
    console.log('2. Running resume analysis...');
    const startTime = Date.now();
    
    const analysisResult = await analyzeResumeWithGemini(
      sampleResumeText, 
      samplePersonalDetails, 
      sampleJobDetails
    );
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    console.log(`✅ Analysis completed in ${processingTime}ms`);
    
    // Validate the result structure
    console.log('3. Validating analysis result structure...');
    
    if (analysisResult.matchScore >= 0 && analysisResult.matchScore <= 100) {
      console.log(`✅ Match Score: ${analysisResult.matchScore}%`);
    } else {
      console.log('❌ Invalid match score');
    }
    
    if (analysisResult.keywordAnalysis && Array.isArray(analysisResult.keywordAnalysis.neededKeywords)) {
      console.log(`✅ Keyword Analysis: ${analysisResult.keywordAnalysis.neededKeywords.length} keywords analyzed`);
      console.log(`   Coverage: ${analysisResult.keywordAnalysis.coveragePercentage}%`);
    } else {
      console.log('❌ Invalid keyword analysis structure');
    }
    
    if (analysisResult.experienceAnalysis && Array.isArray(analysisResult.experienceAnalysis)) {
      console.log(`✅ Experience Analysis: ${analysisResult.experienceAnalysis.length} positions analyzed`);
    } else {
      console.log('❌ Invalid experience analysis structure');
    }
    
    if (analysisResult.projectAnalysis && Array.isArray(analysisResult.projectAnalysis)) {
      console.log(`✅ Project Analysis: ${analysisResult.projectAnalysis.length} projects analyzed`);
    } else {
      console.log('❌ Invalid project analysis structure');
    }
    
    if (analysisResult.overallSuggestions && typeof analysisResult.overallSuggestions === 'string') {
      console.log(`✅ Overall Suggestions: "${analysisResult.overallSuggestions.substring(0, 100)}..."`);
    } else {
      console.log('❌ Missing or invalid overall suggestions');
    }
    
    // Display full results
    console.log('\n📊 Full Analysis Results:');
    console.log(JSON.stringify(analysisResult, null, 2));
    
    console.log('\n🎉 Resume Analysis Test Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

async function testPDFExtraction(pdfPath) {
  if (!pdfPath) {
    console.log('\n⚠️  No PDF path provided, skipping PDF extraction test');
    console.log('   To test PDF extraction, provide a path: node test/resumeAnalysisTest.js /path/to/resume.pdf');
    return;
  }
  
  console.log(`\n🧪 Testing PDF Extraction with: ${pdfPath}`);
  
  try {
    // Test PDF validation
    console.log('1. Validating PDF file...');
    if (isValidPDF(pdfPath)) {
      console.log('✅ PDF file is valid');
    } else {
      console.log('❌ Invalid PDF file');
      return;
    }
    
    // Test text extraction
    console.log('2. Extracting text from PDF...');
    const startTime = Date.now();
    
    const extractedText = await extractTextFromPDFWithFallback(pdfPath);
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    console.log(`✅ Text extracted in ${processingTime}ms`);
    console.log(`   Text length: ${extractedText.length} characters`);
    console.log(`   Preview: "${extractedText.substring(0, 200)}..."`);
    
    // Test analysis with extracted text
    console.log('3. Running analysis with extracted text...');
    const analysisResult = await analyzeResumeWithGemini(
      extractedText, 
      samplePersonalDetails, 
      sampleJobDetails
    );
    
    console.log(`✅ Analysis completed with match score: ${analysisResult.matchScore}%`);
    
  } catch (error) {
    console.error('❌ PDF extraction test failed:', error.message);
  }
}

// Run the tests
async function runAllTests() {
  await testResumeAnalysis();
  
  // Check if PDF path was provided as command line argument
  const pdfPath = process.argv[2];
  if (pdfPath) {
    await testPDFExtraction(pdfPath);
  } else {
    console.log('\n💡 Tip: To test PDF extraction, run:');
    console.log('   node test/resumeAnalysisTest.js "/path/to/your/resume.pdf"');
  }
}

runAllTests();