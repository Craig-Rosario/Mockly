import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiConnection() {
  try {
    console.log('Testing Gemini AI connection...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    Test prompt: Analyze this sample resume data and return JSON.
    
    Candidate: John Doe
    Job: Software Engineer
    Resume: "Experienced developer with React and Node.js skills"
    
    Return only valid JSON with this structure:
    {
      "matchScore": 75,
      "keywordAnalysis": {
        "coveragePercentage": 60,
        "neededKeywords": [{"keyword": "React", "found": true}, {"keyword": "Python", "found": false}]
      },
      "overallSuggestions": "Add more backend experience",
      "experienceAnalysis": [{"title": "Developer", "relevanceScore": 8, "depthScore": 6, "suggestions": ["Add metrics"]}],
      "projectAnalysis": [{"title": "Web App", "relevanceScore": 7, "complexityScore": 5, "suggestions": ["Deploy project"]}]
    }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini Response:', text);
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(text.trim().replace(/```json/g, '').replace(/```/g, ''));
      console.log('✅ JSON parsing successful:', jsonResponse);
      return jsonResponse;
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Gemini connection failed:', error);
    return null;
  }
}

// Run the test
testGeminiConnection()
  .then(result => {
    if (result) {
      console.log('🎉 Gemini test successful!');
    } else {
      console.log('💥 Gemini test failed!');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Test error:', error);
    process.exit(1);
  });