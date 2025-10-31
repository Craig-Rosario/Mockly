import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  try {
    console.log('🔍 Listing available Gemini models...');
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const models = await genAI.listModels();
    
    console.log('\n📋 Available models:');
    const compatibleModels = [];
    
    for (const model of models) {
      console.log(`- ${model.name}`);
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        compatibleModels.push(model.name);
      }
    }
    
    console.log(`\n🎉 Found ${compatibleModels.length} compatible models!`);
    if (compatibleModels.length > 0) {
      console.log('Try using:', compatibleModels[0]);
    }
    
  } catch (error) {
    console.error('❌ Failed to list models:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

listModels();