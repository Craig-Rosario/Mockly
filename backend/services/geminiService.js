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
    let cleanedResponse = text.trim().replace(/```json/g, '').replace(/```/g, '');
    
    // More robust JSON repair for truncated responses
    console.log('Raw response length:', text.length);
    console.log('Cleaned response length:', cleanedResponse.length);
    
    // Try to find and extract valid JSON from potentially malformed response
    const repairJSON = (jsonStr) => {
      let repairedJSON = jsonStr.trim();
      
      // Check for incomplete overallSuggestions field (most common truncation point)
      if (repairedJSON.includes('"overallSuggestions":') && repairedJSON.includes('user adopti')) {
        console.log('Detected truncated overallSuggestions field');
        
        // Find the start of overallSuggestions
        const suggestionsStart = repairedJSON.indexOf('"overallSuggestions":');
        const beforeSuggestions = repairedJSON.substring(0, suggestionsStart);
        
        // Extract the partial suggestion text and clean it up
        const afterSuggestions = repairedJSON.substring(suggestionsStart);
        const partialMatch = afterSuggestions.match(/"overallSuggestions":\s*"([^"]*)/);
        
        if (partialMatch) {
          let partialSuggestion = partialMatch[1];
          
          // Clean up common truncation artifacts
          partialSuggestion = partialSuggestion.replace(/\s*user adopti.*$/, '');
          partialSuggestion = partialSuggestion.replace(/\s*performance metrics.*$/, '');
          partialSuggestion += '.'; // Add proper ending
          
          // Reconstruct complete JSON
          repairedJSON = beforeSuggestions + 
            '"overallSuggestions":"' + partialSuggestion + 
            '","experienceAnalysis":[],"projectAnalysis":[]}';
        }
      }
      
      // Handle other truncation patterns
      else if (repairedJSON.includes('"experienceAnalysis":') && !repairedJSON.includes('"projectAnalysis":')) {
        // Truncated during experience analysis
        const expStart = repairedJSON.indexOf('"experienceAnalysis":');
        const beforeExp = repairedJSON.substring(0, expStart);
        repairedJSON = beforeExp + '"experienceAnalysis":[],"projectAnalysis":[]}';
      }
      
      // Final cleanup: ensure proper JSON closure
      if (!repairedJSON.trim().endsWith('}')) {
        if (repairedJSON.includes('{') && !repairedJSON.includes('}')) {
          repairedJSON += '}';
        }
      }
      
      return repairedJSON;
    };
    
    // Apply JSON repair
    cleanedResponse = repairJSON(cleanedResponse);
    console.log('Repaired response length:', cleanedResponse.length);
    
    try {
      const parsedResult = JSON.parse(cleanedResponse);
      console.log('Successfully parsed JSON from Gemini');
      
      // Validate the structure of the response
      try {
        validateAnalysisResult(parsedResult);
        console.log('Analysis result validated successfully');
        return parsedResult;
      } catch (validationError) {
        console.error('Validation failed, using fallback result:', validationError);
        console.error('Parsed result that failed validation:', JSON.stringify(parsedResult, null, 2));
        // Don't throw here, let it fall through to the fallback logic
        throw validationError;
      }
    } catch (parseError) {
      console.error('Failed to parse or validate Gemini response:', parseError);
      console.error('Raw response text:', text.substring(0, 1000));
      console.error('Cleaned response:', cleanedResponse.substring(0, 1000));
      
      // Try to extract partial valid data before giving up
      try {
        console.log('Attempting to extract partial valid JSON...');
        
        // Try to extract at least the basic structure we can parse
        const extractPartialJSON = (jsonStr) => {
          const patterns = {
            matchScore: /"matchScore":\s*(\d+)/,
            coveragePercentage: /"coveragePercentage":\s*(\d+)/,
            neededKeywords: /"neededKeywords":\s*(\[[^\]]*\])/
          };
          
          const extracted = {
            matchScore: 0,
            keywordAnalysis: {
              coveragePercentage: 0,
              neededKeywords: []
            },
            overallSuggestions: "",
            experienceAnalysis: [],
            projectAnalysis: []
          };
          
          // Extract match score
          const matchScoreMatch = jsonStr.match(patterns.matchScore);
          if (matchScoreMatch) {
            extracted.matchScore = parseInt(matchScoreMatch[1]);
          }
          
          // Extract coverage percentage
          const coverageMatch = jsonStr.match(patterns.coveragePercentage);
          if (coverageMatch) {
            extracted.keywordAnalysis.coveragePercentage = parseInt(coverageMatch[1]);
          }
          
          // Try to extract keywords array (even if incomplete)
          const keywordsMatch = jsonStr.match(/"neededKeywords":\s*(\[.*?)(?:\]|$)/s);
          if (keywordsMatch) {
            try {
              let keywordsStr = keywordsMatch[1];
              if (!keywordsStr.endsWith(']')) {
                keywordsStr += ']';
              }
              const keywords = JSON.parse(keywordsStr);
              if (Array.isArray(keywords)) {
                extracted.keywordAnalysis.neededKeywords = keywords.filter(k => k.keyword && typeof k.found === 'boolean');
              }
            } catch (e) {
              console.log('Could not parse keywords, using empty array');
            }
          }
          
          return extracted;
        };
        
        const partialResult = extractPartialJSON(text);
        console.log('Extracted partial result:', partialResult);
        
        // Validate the partial result
        try {
          validateAnalysisResult(partialResult);
          console.log('Partial result validated successfully');
          return partialResult;
        } catch (validationError) {
          console.log('Partial result validation failed, using fallback');
          throw validationError;
        }
        
      } catch (extractError) {
        console.error('Failed to extract partial data:', extractError);
        throw parseError;
      }
    }
    
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    
    // If quota exceeded, API unavailable, or validation failed, return fallback data
    if (error.status === 429 || 
        error.message.includes('quota') || 
        error.message.includes('Too Many Requests') ||
        error.message.includes('Invalid') ||
        error.message.includes('keywordAnalysis') ||
        error.message.includes('experienceAnalysis') ||
        error.message.includes('parse')) {
      console.log('🔄 API issue or validation error, returning blank analysis data...');
      
      return {
        matchScore: 0,
        keywordAnalysis: {
          coveragePercentage: 0,
          neededKeywords: []
        },
        overallSuggestions: "",
        experienceAnalysis: [],
        projectAnalysis: []
      };
    } else {
      // For any other error types, also return blank data instead of throwing
      console.log('🔄 Unknown error, returning blank analysis data...');
      return {
        matchScore: 0,
        keywordAnalysis: {
          coveragePercentage: 0,
          neededKeywords: []
        },
        overallSuggestions: "",
        experienceAnalysis: [],
        projectAnalysis: []
      };
    }
  }
};

/**
 * Generate MCQs using Gemini AI
 * @param {Object} jobDetails - Job details including description and required skills
 * @returns {Promise<Object>} - Generated MCQs
 */
export const generateMCQsWithGemini = async (jobDetails) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: modelConfig
    });

    const prompt = createMCQPrompt(jobDetails);
    
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
  // Check basic structure
  if (!result || typeof result !== 'object') {
    throw new Error('Result must be an object');
  }

  // Validate matchScore
  if (!('matchScore' in result) || typeof result.matchScore !== 'number' || result.matchScore < 0 || result.matchScore > 100) {
    throw new Error('matchScore must be a number between 0 and 100');
  }
  
  // Validate keywordAnalysis
  if (!result.keywordAnalysis || typeof result.keywordAnalysis !== 'object') {
    throw new Error('keywordAnalysis is required and must be an object');
  }
  
  if (typeof result.keywordAnalysis.coveragePercentage !== 'number') {
    throw new Error('keywordAnalysis.coveragePercentage must be a number');
  }
  
  if (!Array.isArray(result.keywordAnalysis.neededKeywords)) {
    throw new Error('keywordAnalysis.neededKeywords must be an array');
  }

  // Validate each keyword in neededKeywords
  for (let i = 0; i < result.keywordAnalysis.neededKeywords.length; i++) {
    const keyword = result.keywordAnalysis.neededKeywords[i];
    if (!keyword.keyword || typeof keyword.found !== 'boolean') {
      throw new Error(`Invalid keyword structure at index ${i}: must have 'keyword' string and 'found' boolean`);
    }
  }
  
  // Ensure required fields exist (can be empty arrays/strings)
  if (!('overallSuggestions' in result)) {
    result.overallSuggestions = '';
  }
  if (!('experienceAnalysis' in result)) {
    result.experienceAnalysis = [];
  }
  if (!('projectAnalysis' in result)) {
    result.projectAnalysis = [];
  }

  // Validate arrays are actually arrays
  if (!Array.isArray(result.experienceAnalysis)) {
    throw new Error('experienceAnalysis must be an array');
  }
  if (!Array.isArray(result.projectAnalysis)) {
    throw new Error('projectAnalysis must be an array');
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

/**
 * Generate improvement suggestions using Gemini AI based on MCQ and Resume analysis data
 * @param {Object} mcqData - MCQ results data
 * @param {Object} resumeAnalysis - Resume analysis data
 * @returns {Promise<Array>} - Array of improvement suggestions
 */
export const generateImprovementsWithGemini = async (mcqData, resumeAnalysis) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: modelConfig
    });

    const prompt = createImprovementPrompt(mcqData, resumeAnalysis);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response and parse JSON
    const cleanedResponse = text.trim().replace(/```json/g, '').replace(/```/g, '');
    
    try {
      const parsedResult = JSON.parse(cleanedResponse);
      
      // Validate the structure of the response
      if (!Array.isArray(parsedResult)) {
        throw new Error('Response should be an array of improvements');
      }
      
      return parsedResult;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      throw new Error('Invalid JSON response from Gemini AI');
    }
    
  } catch (error) {
    console.error('Error in generateImprovementsWithGemini:', error);
    throw new Error(`Failed to generate improvements: ${error.message}`);
  }
};

/**
 * Create improvement suggestions prompt for Gemini AI
 * @param {Object} mcqData - MCQ results data
 * @param {Object} resumeAnalysis - Resume analysis data
 * @returns {string} - Formatted prompt for Gemini
 */
const createImprovementPrompt = (mcqData, resumeAnalysis) => {
  let dataAnalysis = "";

  if (mcqData) {
    dataAnalysis += `
MCQ Performance Analysis:
- Total Score: ${mcqData.results.score}%
- Correct Answers: ${mcqData.results.correctAnswers}/${mcqData.results.totalQuestions}
- Time Taken: ${mcqData.results.timeTaken} seconds
- Topic-wise Performance: ${JSON.stringify(mcqData.results.topicWisePerformance)}
- Incorrect Answers Analysis: ${JSON.stringify(mcqData.results.answersSubmitted?.filter(ans => !ans.isCorrect))}
`;
  }

  if (resumeAnalysis) {
    dataAnalysis += `
Resume Analysis Results:
- Match Score: ${resumeAnalysis.analysisResult.matchScore}%
- Keyword Coverage: ${resumeAnalysis.analysisResult.keywordAnalysis?.coveragePercentage}%
- Missing Keywords: ${JSON.stringify(resumeAnalysis.analysisResult.keywordAnalysis?.neededKeywords?.filter(k => !k.found))}
- Experience Analysis: ${JSON.stringify(resumeAnalysis.analysisResult.experienceAnalysis)}
- Project Analysis: ${JSON.stringify(resumeAnalysis.analysisResult.projectAnalysis)}
- Overall Suggestions: ${resumeAnalysis.analysisResult.overallSuggestions}
`;
  }

  return `
You are a career improvement expert. Based on the following assessment data, provide specific, actionable improvement suggestions.

${dataAnalysis}

Please analyze this data and provide improvement suggestions in the following JSON format:
[
  {
    "title": "Brief improvement title (3-7 words)",
    "description": "Detailed description of what needs to be improved and how",
    "severity": "high|medium|low"
  }
]

Guidelines for suggestions:
1. Focus on specific weaknesses identified in the data
2. Provide actionable advice that the candidate can implement
3. Prioritize suggestions based on impact on job matching
4. For MCQ weaknesses, suggest specific study areas or practice topics
5. For resume gaps, suggest concrete ways to improve content
6. Use "high" severity for critical gaps, "medium" for important improvements, "low" for minor enhancements
7. Limit to 3-5 most impactful suggestions
8. Make each suggestion specific and measurable when possible

Return only the JSON array, no additional text or formatting.
`;
};