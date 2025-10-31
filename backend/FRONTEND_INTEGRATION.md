# Frontend Integration Guide for Resume Analysis

## Overview

This guide shows how to integrate the resume analysis backend with your React frontend to automatically populate the Resume Analysis page with real data from Gemini AI.

## Quick Start

### 1. Trigger Resume Analysis

After a user submits their job application, trigger the analysis:

```javascript
// In your JobDetails.tsx or similar component
const triggerResumeAnalysis = async (applicationId) => {
  try {
    const token = await getToken();
    
    const response = await fetch(`/api/users/analyze-resume/${applicationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Resume analysis completed:', result);
    
    return result;
  } catch (error) {
    console.error('Failed to analyze resume:', error);
    throw error;
  }
};
```

### 2. Fetch Analysis Results

In your Resume Analysis page component:

```javascript
// In ResumeAnalysis.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const ResumeAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { applicationId } = useParams(); // or get from context/localStorage
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = await getToken();
        
        const response = await fetch(`/api/users/resume-analysis/${applicationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAnalysisData(data.analysis);
        } else if (response.status === 404) {
          // Analysis not found, maybe trigger it
          console.log('Analysis not found, you may want to trigger it');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchAnalysis();
    }
  }, [applicationId, getToken]);

  if (loading) return <div>Loading analysis...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analysisData) return <div>No analysis available</div>;

  return (
    <div className="resume-analysis">
      {/* Use real data instead of dummy data */}
      <MatchScore score={analysisData.matchScore} />
      <KeywordAnalysis data={analysisData.keywordAnalysis} />
      <ExperienceAnalysis data={analysisData.experienceAnalysis} />
      <ProjectAnalysis data={analysisData.projectAnalysis} />
      <OverallSuggestions suggestions={analysisData.overallSuggestions} />
    </div>
  );
};
```

### 3. Update Your API Helper

Add these functions to your `api.ts` file:

```typescript
// In lib/api.ts
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
      return result.status; // 'pending', 'processing', 'completed', 'error'
    } catch (error) {
      return 'not_found';
    }
  }
};
```

## Component Examples

### Match Score Component

```jsx
const MatchScore = ({ score }) => (
  <div className="match-score">
    <h3>Overall Match Score</h3>
    <div className="score-circle">
      <span className="score">{score}%</span>
    </div>
    <p className={score >= 80 ? 'text-green' : score >= 60 ? 'text-yellow' : 'text-red'}>
      {score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : 'Needs Improvement'}
    </p>
  </div>
);
```

### Keyword Analysis Component

```jsx
const KeywordAnalysis = ({ data }) => (
  <div className="keyword-analysis">
    <h3>Keyword Analysis</h3>
    <p>Coverage: {data.coveragePercentage}%</p>
    
    <div className="keywords">
      <div className="found-keywords">
        <h4>✅ Found Skills</h4>
        {data.neededKeywords
          .filter(k => k.found)
          .map(keyword => (
            <span key={keyword.keyword} className="keyword found">
              {keyword.keyword}
            </span>
          ))}
      </div>
      
      <div className="missing-keywords">
        <h4>❌ Missing Skills</h4>
        {data.neededKeywords
          .filter(k => !k.found)
          .map(keyword => (
            <span key={keyword.keyword} className="keyword missing">
              {keyword.keyword}
            </span>
          ))}
      </div>
    </div>
  </div>
);
```

### Experience Analysis Component

```jsx
const ExperienceAnalysis = ({ data }) => (
  <div className="experience-analysis">
    <h3>Experience Analysis</h3>
    {data.map((exp, index) => (
      <div key={index} className="experience-item">
        <h4>{exp.title}</h4>
        <div className="scores">
          <span>Relevance: {exp.relevanceScore}/10</span>
          <span>Depth: {exp.depthScore}/10</span>
        </div>
        <div className="suggestions">
          <h5>Suggestions:</h5>
          <ul>
            {exp.suggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);
```

## Integration Workflow

### 1. After Job Application Submission

```javascript
// In JobDetails.tsx after successful submission
const handleSubmit = async () => {
  try {
    // Submit the job application first
    const applicationResult = await submitApplication();
    const applicationId = applicationResult.application._id;
    
    // Store application ID for later use
    localStorage.setItem('currentApplicationId', applicationId);
    
    // Trigger resume analysis (don't wait for it)
    resumeAnalysisApi.analyzeResume(applicationId, token)
      .then(() => console.log('Analysis started'))
      .catch(err => console.error('Analysis failed to start:', err));
    
    // Navigate to resume analysis page
    navigate('/add-jobs/resume-analysis');
    
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

### 2. In Resume Analysis Page

```javascript
// Show loading state while analysis is processing
const ResumeAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [status, setStatus] = useState('loading');
  
  useEffect(() => {
    const applicationId = localStorage.getItem('currentApplicationId');
    
    const checkAnalysis = async () => {
      try {
        const token = await getToken();
        const response = await resumeAnalysisApi.getAnalysis(applicationId, token);
        
        if (response.status === 'completed') {
          setAnalysisData(response.analysis);
          setStatus('completed');
        } else if (response.status === 'processing') {
          setStatus('processing');
          // Check again in 5 seconds
          setTimeout(checkAnalysis, 5000);
        } else if (response.status === 'error') {
          setStatus('error');
        }
      } catch (error) {
        if (error.message.includes('404')) {
          // Analysis not started yet, trigger it
          await resumeAnalysisApi.analyzeResume(applicationId, token);
          setStatus('processing');
          setTimeout(checkAnalysis, 3000);
        }
      }
    };
    
    checkAnalysis();
  }, []);

  // Render based on status
  if (status === 'processing') {
    return <LoadingSpinner message="Analyzing your resume..." />;
  }
  
  if (status === 'error') {
    return <ErrorMessage message="Analysis failed. Please try again." />;
  }
  
  if (status === 'completed' && analysisData) {
    return <ResumeAnalysisResults data={analysisData} />;
  }
  
  return <div>Loading...</div>;
};
```

## Error Handling

```javascript
const handleAnalysisError = (error) => {
  console.error('Analysis error:', error);
  
  // Show user-friendly error messages
  if (error.message.includes('No resume found')) {
    showErrorToast('Please upload your resume first');
  } else if (error.message.includes('Invalid PDF')) {
    showErrorToast('Resume file appears to be corrupted. Please upload a new one.');
  } else if (error.message.includes('Resume analysis failed')) {
    showErrorToast('Analysis service is temporarily unavailable. Please try again later.');
  } else {
    showErrorToast('Something went wrong. Please try again.');
  }
};
```

## Real-time Updates (Optional)

For a better user experience, you can implement real-time updates:

```javascript
// Poll for analysis completion
const useAnalysisPolling = (applicationId) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [status, setStatus] = useState('pending');
  
  useEffect(() => {
    if (!applicationId) return;
    
    const pollInterval = setInterval(async () => {
      try {
        const token = await getToken();
        const response = await resumeAnalysisApi.getAnalysis(applicationId, token);
        
        setStatus(response.status);
        
        if (response.status === 'completed') {
          setAnalysisData(response.analysis);
          clearInterval(pollInterval);
        } else if (response.status === 'error') {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(pollInterval);
  }, [applicationId]);
  
  return { analysisData, status };
};
```

## Environment Setup

Make sure your `.env` file includes:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string
```

## Testing the Integration

1. Create a job application with an uploaded resume
2. Check that the analysis endpoint is called
3. Verify the analysis results are stored in MongoDB
4. Confirm the frontend displays the real data instead of dummy data

The system will automatically handle PDF text extraction, send the data to Gemini AI for analysis, store the results in MongoDB, and return structured data that your frontend can display directly.