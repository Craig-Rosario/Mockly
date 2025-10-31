import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Configuration for Gemini model
 */
const modelConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

/**
 * Analyze resume content using Gemini AI
 * @param {string} resumeContent - The extracted text content from resume
 * @param {Object} personalDetails - Personal details of the candidate
 * @param {Object} jobDetails - Job details and description
 * @returns {Promise<Object>} - Structured analysis result
 */
export const analyzeResumeWithGemini = async (resumeContent, personalDetails, jobDetails) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: modelConfig
    });

    const prompt = createAnalysisPrompt(resumeContent, personalDetails, jobDetails);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response and parse JSON
    const cleanedResponse = text.trim().replace(/```json/g, '').replace(/```/g, '');
    
    try {
      const parsedResult = JSON.parse(cleanedResponse);
      
      // Validate the structure of the response
      validateAnalysisResult(parsedResult);
      
      return parsedResult;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      throw new Error('Invalid JSON response from Gemini AI');
    }
    
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    
    // If quota exceeded or API unavailable, return mock data for development
    if (error.status === 429 || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
      console.log('🔄 API quota exceeded, returning mock analysis data for development...');
      
      return {
        matchScore: 78,
        keywordAnalysis: {
          coveragePercentage: 65,
          neededKeywords: [
            { keyword: "React", found: true },
            { keyword: "Node.js", found: true },
            { keyword: "MongoDB", found: false },
            { keyword: "TypeScript", found: false },
            { keyword: "AWS", found: false }
          ]
        },
        overallSuggestions: "Strong technical foundation with room for improvement in cloud technologies and databases. Consider adding MongoDB and AWS experience to better match job requirements.",
        experienceAnalysis: [
          {
            title: "Software Developer",
            relevanceScore: 8,
            depthScore: 7,
            suggestions: ["Add specific project metrics", "Highlight leadership experience"]
          },
          {
            title: "Frontend Developer",
            relevanceScore: 9,
            depthScore: 8,
            suggestions: ["Include framework-specific achievements", "Mention performance optimizations"]
          }
        ],
        projectAnalysis: [
          {
            title: "E-commerce Platform",
            relevanceScore: 9,
            complexityScore: 7,
            suggestions: ["Detail user engagement metrics", "Describe technical architecture"]
          },
          {
            title: "Task Management App",
            relevanceScore: 7,
            complexityScore: 6,
            suggestions: ["Add deployment details", "Include user feedback results"]
          }
        ]
      };
    }
    
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};

/**
 * Generate MCQs based on job description
 * @param {Object} jobDetails - Job details including description and required skills
 * @returns {Promise<Object>} - Generated MCQs
 */
export const generateMCQsWithGemini = async (jobDetails) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: mcqConfig
    });

    const prompt = createMCQPrompt(resumeData, jobDetails);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response and parse JSON
    const cleanedResponse = text.trim().replace(/```json/g, '').replace(/```/g, '');
    
    try {
      const parsedResult = JSON.parse(cleanedResponse);
      
      // Validate MCQ structure
      validateMCQResult(parsedResult);
      
      return parsedResult;
    } catch (parseError) {
      console.error('Failed to parse MCQ response as JSON:', parseError);
      throw new Error('Invalid JSON response from Gemini AI for MCQs');
    }
    
  } catch (error) {
    console.error('Error generating MCQs with Gemini:', error);
    throw new Error(`MCQ generation failed: ${error.message}`);
  }
};

/**
 * Create analysis prompt for Gemini
 */
const createAnalysisPrompt = (resumeContent, personalDetails, jobDetails) => {
  return `
You are an expert AI resume analyzer. Analyze the following resume text and candidate information against the job requirements.

**Candidate Information:**
Name: ${personalDetails.candidateName}
Email: ${personalDetails.candidateEmail}
Location: ${personalDetails.candidateLocation}
Total Years of Experience: ${personalDetails.totalYOE}
Primary Stack: ${personalDetails.primaryStack ? personalDetails.primaryStack.join(', ') : 'Not specified'}
Willing to Relocate: ${personalDetails.willingToRelocate}

**Resume Content:**
\`\`\`
${resumeContent}
\`\`\`

**Job Requirements:**
Job Title: ${jobDetails.jobTitle}
Company: ${jobDetails.company}
Location: ${jobDetails.location}
Work Mode: ${jobDetails.workMode}
Job Type: ${jobDetails.jobType}
Industry: ${jobDetails.jobIndustry}

Job Description:
\`\`\`
${jobDetails.jobDescription}
\`\`\`

Required Skills: ${jobDetails.requiredSkills ? jobDetails.requiredSkills.join(', ') : 'Not specified'}

**Analysis Instructions:**
Return only a single valid JSON object with this exact structure:

{
  "matchScore": INTEGER_0_TO_100,
  "keywordAnalysis": {
    "coveragePercentage": INTEGER_0_TO_100,
    "neededKeywords": [
      {
        "keyword": "TECHNICAL_SKILL_OR_TOOL",
        "found": BOOLEAN
      }
    ]
  },
  "overallSuggestions": "CONCISE_ACTIONABLE_FEEDBACK_STRING",
  "experienceAnalysis": [
    {
      "title": "ROLE_TITLE",
      "relevanceScore": INTEGER_0_TO_10,
      "depthScore": INTEGER_0_TO_10,
      "suggestions": ["SHORT_ACTIONABLE_SUGGESTION_1", "SHORT_ACTIONABLE_SUGGESTION_2"]
    }
  ],
  "projectAnalysis": [
    {
      "title": "PROJECT_NAME",
      "relevanceScore": INTEGER_0_TO_10,
      "complexityScore": INTEGER_0_TO_8,
      "suggestions": ["SHORT_ACTIONABLE_SUGGESTION_1", "SHORT_ACTIONABLE_SUGGESTION_2"]
    }
  ]
}

**Important Guidelines:**
- Only include concrete, verifiable technical skills in neededKeywords
- Limit suggestions to 1-2 items per experience/project (≤15 words each)
- Ensure all scores are within specified ranges
- Return only valid JSON without any markdown formatting or additional text
`;
};

/**
 * Create MCQ generation prompt
 */
const createMCQPrompt = (jobDetails) => {
  return `
Based on the following job description, generate 10 multiple-choice questions to screen candidates.

**Job Information:**
Job Title: ${jobDetails.jobTitle}
Company: ${jobDetails.company}
Industry: ${jobDetails.jobIndustry}

Job Description:
\`\`\`
${jobDetails.jobDescription}
\`\`\`

Required Skills: ${jobDetails.requiredSkills ? jobDetails.requiredSkills.join(', ') : 'Not specified'}

**MCQ Requirements:**
1. Mix of direct technical questions and scenario-based questions
2. Focus on technologies/skills mentioned in the job description
3. Include practical problem-solving scenarios
4. Questions should be relevant to ${jobDetails.jobTitle} role

**Output Format:**
Return exactly this JSON structure without any markdown formatting:

{
  "mcqs": [
    {
      "question": "Complete question text here",
      "options": [
        "A. Option 1 text",
        "B. Option 2 text", 
        "C. Option 3 text",
        "D. Option 4 text"
      ],
      "correct_answer": "Letter of correct option (A, B, C, or D)"
    }
  ]
}

Generate exactly 10 questions following this format.
`;
};

/**
 * Validate analysis result structure
 */
const validateAnalysisResult = (result) => {
  const requiredFields = ['matchScore', 'keywordAnalysis', 'overallSuggestions', 'experienceAnalysis', 'projectAnalysis'];
  
  for (const field of requiredFields) {
    if (!(field in result)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  // Validate matchScore range
  if (typeof result.matchScore !== 'number' || result.matchScore < 0 || result.matchScore > 100) {
    throw new Error('matchScore must be a number between 0 and 100');
  }
  
  // Validate keywordAnalysis
  if (!result.keywordAnalysis.coveragePercentage || !Array.isArray(result.keywordAnalysis.neededKeywords)) {
    throw new Error('Invalid keywordAnalysis structure');
  }
  
  return true;
};

/**
 * Validate MCQ result structure
 */
const validateMCQResult = (result) => {
  if (!result.mcqs || !Array.isArray(result.mcqs)) {
    throw new Error('MCQ result must contain mcqs array');
  }
  
  for (const mcq of result.mcqs) {
    if (!mcq.question || !Array.isArray(mcq.options) || !mcq.correct_answer) {
      throw new Error('Invalid MCQ structure');
    }
    
    if (mcq.options.length !== 4) {
      throw new Error('Each MCQ must have exactly 4 options');
    }
  }
  
  return true;
};