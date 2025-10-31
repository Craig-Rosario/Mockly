import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini() {
  try {
    console.log('🔑 Testing Gemini API connection...');
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log('📡 Sending test prompt to Gemini...');
    
    const prompt = "Hello! Please respond with 'Gemini AI is working correctly' to confirm the connection.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini Response:', text);
    console.log('🎉 Gemini AI connection successful!');
    
  } catch (error) {
    console.error('❌ Gemini test failed:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testGemini();