import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import PDFParser from 'pdf2json';

/**
 * Extract text content from PDF file using pdf-parse
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    
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
 * Alternative method using pdf2json (already available in package.json)
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFAlternative = (filePath) => {
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
    
    // Load PDF file
    pdfParser.loadPDF(filePath);
  });
};

/**
 * Extract text with fallback mechanism
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromPDFWithFallback = async (filePath) => {
  try {
    // Try primary method first
    return await extractTextFromPDF(filePath);
  } catch (primaryError) {
    console.warn('Primary PDF extraction failed, trying alternative method:', primaryError.message);
    
    try {
      // Fallback to alternative method
      return await extractTextFromPDFAlternative(filePath);
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
 * @param {string} filePath - Path to the PDF file
 * @returns {boolean} - True if valid PDF
 */
export const isValidPDF = (filePath) => {
  try {
    console.log('Validating PDF file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('PDF file does not exist at path:', filePath);
      return false;
    }
    
    const stats = fs.statSync(filePath);
    console.log('PDF file size:', stats.size, 'bytes');
    
    if (stats.size === 0) {
      console.log('PDF file is empty');
      return false;
    }
    
    // Check file extension
    const extension = path.extname(filePath).toLowerCase();
    console.log('File extension:', extension);
    
    if (extension !== '.pdf') {
      console.log('Invalid file extension, expected .pdf');
      return false;
    }
    
    // Read first few bytes to check PDF header
    const buffer = fs.readFileSync(filePath, { start: 0, end: 4 });
    const header = buffer.toString('ascii');
    console.log('PDF header:', header);
    
    const isValid = header === '%PDF';
    console.log('PDF validation result:', isValid);
    
    return isValid;
  } catch (error) {
    console.error('Error validating PDF:', error);
    return false;
  }
};