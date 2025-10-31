import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
  try {
    console.log('Listing available Gemini models...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('Available models:');
    data.models.forEach(model => {
      console.log(`- ${model.name} (${model.displayName})`);
      if (model.supportedGenerationMethods) {
        console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
    });
    
    // Find models that support generateContent
    const contentModels = data.models.filter(model => 
      model.supportedGenerationMethods && 
      model.supportedGenerationMethods.includes('generateContent')
    );
    
    console.log('\nModels supporting generateContent:');
    contentModels.forEach(model => {
      console.log(`- ${model.name}`);
    });
    
    return contentModels;
    
  } catch (error) {
    console.error('❌ Failed to list models:', error);
    return null;
  }
}

// Run the test
listAvailableModels()
  .then(models => {
    if (models && models.length > 0) {
      console.log(`\n🎉 Found ${models.length} compatible models!`);
      console.log(`Try using: ${models[0].name.split('/')[1]}`);
    } else {
      console.log('💥 No compatible models found!');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Test error:', error);
    process.exit(1);
  });