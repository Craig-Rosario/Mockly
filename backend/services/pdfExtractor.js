import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import PDFParser from 'pdf2json';

/**
 * Extract text content from PDF file using pdf-parse
 * @param {string|Buffer} input - File path or Buffer containing PDF data
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDF = async (input) => {
  try {
    let pdfBuffer;
    
    // Handle different input types
    if (Buffer.isBuffer(input)) {
      pdfBuffer = input;
    } else if (typeof input === 'string') {
      // Check if it's a file path or base64 string
      if (input.startsWith('data:')) {
        // Base64 data URL
        const base64Data = input.split(',')[1];
        pdfBuffer = Buffer.from(base64Data, 'base64');
      } else if (fs.existsSync(input)) {
        // File path (fallback for local development)
        pdfBuffer = fs.readFileSync(input);
      } else {
        throw new Error('Invalid input: not a valid file path or base64 string');
      }
    } else {
      throw new Error('Input must be a file path, base64 string, or Buffer');
    }
    
    // Extract text using pdf-parse
    const data = await pdfParse(pdfBuffer);
    
    // Clean and format the extracted text
    const cleanedText = data.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    return cleanedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Alternative method using pdf2json
 * @param {string|Buffer} input - File path or Buffer containing PDF data
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFAlternative = (input) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(new Error(`PDF parsing error: ${errData.parserError}`));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        let extractedText = '';
        
        // Extract text from each page
        pdfData.Pages.forEach(page => {
          page.Texts.forEach(text => {
            text.R.forEach(textRun => {
              extractedText += decodeURIComponent(textRun.T) + ' ';
            });
          });
          extractedText += '\n';
        });
        
        // Clean and format the text
        const cleanedText = extractedText
          .replace(/\s+/g, ' ')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n');
        
        resolve(cleanedText);
      } catch (error) {
        reject(new Error(`Failed to process PDF data: ${error.message}`));
      }
    });
    
    try {
      let pdfBuffer;
      
      // Handle different input types
      if (Buffer.isBuffer(input)) {
        pdfBuffer = input;
      } else if (typeof input === 'string') {
        if (input.startsWith('data:')) {
          // Base64 data URL
          const base64Data = input.split(',')[1];
          pdfBuffer = Buffer.from(base64Data, 'base64');
        } else if (fs.existsSync(input)) {
          // File path (fallback for local development)
          pdfBuffer = fs.readFileSync(input);
        } else {
          throw new Error('Invalid input: not a valid file path or base64 string');
        }
      } else {
        throw new Error('Input must be a file path, base64 string, or Buffer');
      }
      
      // Parse PDF from buffer
      pdfParser.parseBuffer(pdfBuffer);
    } catch (error) {
      reject(new Error(`Failed to load PDF: ${error.message}`));
    }
  });
};

/**
 * Extract text with fallback mechanism
 * @param {string|Buffer} input - File path, base64 string, or Buffer containing PDF data
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFWithFallback = async (input) => {
  try {
    // Try primary method first
    return await extractTextFromPDF(input);
  } catch (primaryError) {
    console.warn('Primary PDF extraction failed, trying alternative method:', primaryError.message);
    
    try {
      // Fallback to alternative method
      return await extractTextFromPDFAlternative(input);
    } catch (fallbackError) {
      console.error('Both PDF extraction methods failed:', {
        primary: primaryError.message,
        fallback: fallbackError.message
      });
      throw new Error(`Unable to extract text from PDF using any available method`);
    }
  }
};

/**
 * Validate PDF file
 * @param {string|Buffer} input - File path, base64 string, or Buffer containing PDF data
 * @returns {boolean} - True if valid PDF
 */
export const isValidPDF = (input) => {
  try {
    console.log('Validating PDF input type:', typeof input);
    
    let buffer;
    
    // Handle different input types
    if (Buffer.isBuffer(input)) {
      buffer = input;
    } else if (typeof input === 'string') {
      if (input.startsWith('data:')) {
        // Base64 data URL
        try {
          const base64Data = input.split(',')[1];
          buffer = Buffer.from(base64Data, 'base64');
        } catch (error) {
          console.error('Error parsing base64 data:', error);
          return false;
        }
      } else {
        // File path (fallback for local development)
        try {
          const normalizedPath = path.resolve(input);
          
          if (!fs.existsSync(normalizedPath) && !fs.existsSync(input)) {
            console.log('PDF file does not exist');
            return false;
          }
          
          const filePath = fs.existsSync(normalizedPath) ? normalizedPath : input;
          const stats = fs.statSync(filePath);
          
          if (stats.size === 0) {
            console.log('PDF file is empty');
            return false;
          }
          
          // Check file extension
          const extension = path.extname(filePath).toLowerCase();
          if (extension !== '.pdf') {
            console.log('Invalid file extension, expected .pdf');
            return false;
          }
          
          buffer = fs.readFileSync(filePath, { start: 0, end: 4 });
        } catch (error) {
          console.error('Error reading file:', error);
          return false;
        }
      }
    } else {
      console.log('Invalid input type for PDF validation');
      return false;
    }
    
    // Check PDF header
    if (!buffer || buffer.length < 4) {
      console.log('Insufficient data to validate PDF header');
      return false;
    }
    
    const header = buffer.toString('ascii', 0, 4);
    console.log('PDF header:', header);
    
    const isValid = header === '%PDF';
    console.log('PDF validation result:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('Error validating PDF:', error);
    return false;
  }
};