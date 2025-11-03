import { useAuth } from '@clerk/react-router';

// API base URLs with fallback (deployed first, then local)
const API_BASE_URLS = [
  'https://mockly-backend.vercel.app/api',
  'http://localhost:5000/api',
];

// Generic API call function with fallback
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // Try each base URL until one works
  for (const baseUrl of API_BASE_URLS) {
    const url = `${baseUrl}${endpoint}`;
    
    try {
      console.log('Making API call:', {
        url,
        method: options.method || 'GET',
        headers: defaultOptions.headers,
      });

      const response = await fetch(url, defaultOptions);

      console.log('API response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const result = await response.json();
        console.log('API success response from:', url);
        return result;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API error from ${url}:`, errorData);
        
        // If it's the last URL, throw the error
        if (baseUrl === API_BASE_URLS[API_BASE_URLS.length - 1]) {
          throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        // Otherwise, continue to next URL
      }
    } catch (error) {
      console.error(`Failed to connect to ${url}:`, error);
      
      // If it's the last URL, throw the error
      if (baseUrl === API_BASE_URLS[API_BASE_URLS.length - 1]) {
        throw error;
      }
      // Otherwise, continue to next URL
    }
  }
};

// Hook for making authenticated API calls
export const useApiCall = () => {
  const { getToken } = useAuth();

  const authenticatedApiCall = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const token = await getToken();
    return apiCall(endpoint, options, token || undefined);
  };

  return authenticatedApiCall;
};

// Resume API calls
export const resumeApi = {
  // Upload resume
  uploadResume: async (file: File, token?: string) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Try each base URL until one works
    for (const baseUrl of API_BASE_URLS) {
      const url = `${baseUrl}/users/upload-resume`;
      
      try {
        console.log(`Trying to upload resume to: ${url}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });

        if (response.ok) {
          console.log(`Successfully uploaded resume to: ${url}`);
          return response.json();
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Upload error from ${url}:`, errorData);
          
          // If it's the last URL, throw the error
          if (baseUrl === API_BASE_URLS[API_BASE_URLS.length - 1]) {
            throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error(`Failed to upload to ${url}:`, error);
        
        // If it's the last URL, throw the error
        if (baseUrl === API_BASE_URLS[API_BASE_URLS.length - 1]) {
          throw error;
        }
      }
    }
  },

  // Get current resume
  getCurrentResume: (token?: string) =>
    apiCall('/users/resume', {}, token),

  // Get resume history
  getResumeHistory: (token?: string) =>
    apiCall('/users/resume-history', {}, token),

  // Delete resume
  deleteResume: (token?: string) =>
    apiCall('/users/resume', {
      method: 'DELETE',
    }, token),
};

// Job Application API calls
export const jobApplicationApi = {
  // Test API connection
  testConnection: (data: any, token?: string) =>
    apiCall('/users/test-job-application', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  // Create a new job application
  createApplication: (data: any, token?: string) =>
    apiCall('/users/job-application', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  // Get all job applications
  getAllApplications: (token?: string) =>
    apiCall('/users/job-applications', {}, token),

  // Get specific job application
  getApplication: (applicationId: string, token?: string) =>
    apiCall(`/users/job-application/${applicationId}`, {}, token),

  // Update job application
  updateApplication: (applicationId: string, data: any, token?: string) =>
    apiCall(`/users/job-application/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),
};

// Resume Analysis API calls
export const resumeAnalysisApi = {
  // Trigger resume analysis
  analyzeResume: (applicationId: string, token?: string) =>
    apiCall(`/users/analyze-resume/${applicationId}`, {
      method: 'POST'
    }, token),

  // Get analysis results
  getAnalysis: (applicationId: string, token?: string) =>
    apiCall(`/users/resume-analysis/${applicationId}`, {}, token),

  // Check analysis status
  getAnalysisStatus: async (applicationId: string, token?: string) => {
    try {
      const result = await apiCall(`/users/resume-analysis/${applicationId}`, {}, token);
      return result.status || 'completed'; // 'pending', 'processing', 'completed', 'error'
    } catch (error) {
      return 'not_found';
    }
  }
};

// MCQ API endpoints
export const mcqApi = {
  // Generate MCQs for a job application
  generateMCQs: (applicationId: string, token?: string) =>
    apiCall(`/users/job-application/${applicationId}/generate-mcqs`, {
      method: 'POST'
    }, token),

  // Get MCQs for a job application
  getMCQs: (applicationId: string, token?: string) =>
    apiCall(`/users/job-application/${applicationId}/mcqs`, {}, token),

  // Submit MCQ answers
  submitMCQs: (applicationId: string, answers: any[], timeTaken: number, token?: string) =>
    apiCall(`/users/job-application/${applicationId}/submit-mcqs`, {
      method: 'POST',
      body: JSON.stringify({
        answers,
        timeTaken
      })
    }, token),

  // Get MCQ results
  getMCQResults: (applicationId: string, token?: string) =>
    apiCall(`/users/job-application/${applicationId}/mcq-results`, {}, token),

  // Test answer format
  testAnswerFormat: (answers: any[], token?: string) =>
    apiCall(`/users/test-answer-format`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    }, token)
};

// Final Report API endpoints
export const finalReportApi = {
  // Get final report metrics
  getMetrics: (applicationId: string, token?: string) =>
    apiCall(`/users/final-report-metrics/${applicationId}`, {}, token),

  // Generate improvement suggestions
  generateImprovements: (applicationId: string, token?: string) =>
    apiCall(`/users/generate-improvements/${applicationId}`, {
      method: 'POST'
    }, token),

  // Get saved final report
  getFinalReport: (applicationId: string, token?: string) =>
    apiCall(`/users/final-report/${applicationId}`, {}, token),

  // Debug endpoint to check existing data
  debugData: (applicationId: string, token?: string) =>
    apiCall(`/users/debug-data/${applicationId}`, {}, token),

  // Test endpoint to check MCQ data storage
  testMCQData: (applicationId: string, token?: string) =>
    apiCall(`/users/test-mcq-data/${applicationId}`, {}, token),

  // Test MCQ answer comparison logic
  testMCQComparison: (testData: { questionOptions: string[], correctAnswer: string, selectedAnswer: any }, token?: string) =>
    apiCall('/users/test-mcq-comparison', {
      method: 'POST',
      body: JSON.stringify(testData)
    }, token)
};