import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@clerk/react-router';
import { jobApplicationApi } from '@/lib/api';

interface PersonalDetails {
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  willingToRelocate: string;
  totalYOE: number;
  primaryStack: string[];
  resumeId?: string | null;
  resumeFileUrl?: string;
}

interface JobDetails {
  jobTitle: string;
  company: string;
  location: string;
  workMode: string;
  jobType: string;
  jobIndustry: string;
  jobDescription: string;
  requiredSkills: string[];
}

interface JobApplicationData {
  personalDetails: PersonalDetails;
  jobDetails: JobDetails;
}

interface JobApplicationContextType {
  applicationData: JobApplicationData;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  updateJobDetails: (details: Partial<JobDetails>) => void;
  resetApplication: () => void;
  submitApplication: (overrideData?: Partial<JobApplicationData>) => Promise<void>;
}

const initialPersonalDetails: PersonalDetails = {
  candidateName: '',
  candidateEmail: '',
  candidateLocation: '',
  willingToRelocate: 'no',
  totalYOE: 0,
  primaryStack: [],
  resumeId: null,
  resumeFileUrl: ''
};

const initialJobDetails: JobDetails = {
  jobTitle: '',
  company: '',
  location: '',
  workMode: 'Remote',
  jobType: '',
  jobIndustry: '',
  jobDescription: '',
  requiredSkills: []
};

const initialApplicationData: JobApplicationData = {
  personalDetails: initialPersonalDetails,
  jobDetails: initialJobDetails
};

const JobApplicationContext = createContext<JobApplicationContextType | undefined>(undefined);

export const useJobApplication = () => {
  const context = useContext(JobApplicationContext);
  if (!context) {
    throw new Error('useJobApplication must be used within a JobApplicationProvider');
  }
  return context;
};

interface JobApplicationProviderProps {
  children: ReactNode;
}

export const JobApplicationProvider: React.FC<JobApplicationProviderProps> = ({ children }) => {
  const [applicationData, setApplicationData] = useState<JobApplicationData>(initialApplicationData);
  const { getToken } = useAuth();

  const updatePersonalDetails = (details: Partial<PersonalDetails>) => {
    setApplicationData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...details }
    }));
  };

  const updateJobDetails = (details: Partial<JobDetails>) => {
    setApplicationData(prev => ({
      ...prev,
      jobDetails: { ...prev.jobDetails, ...details }
    }));
  };

  const resetApplication = () => {
    setApplicationData(initialApplicationData);
  };

  const submitApplication = async (overrideData?: Partial<JobApplicationData>) => {
    try {
      const token = await getToken();
      
      const dataToSubmit = overrideData ? {
        personalDetails: { ...applicationData.personalDetails, ...overrideData.personalDetails },
        jobDetails: { ...applicationData.jobDetails, ...overrideData.jobDetails }
      } : applicationData;
      
      const combinedData = {
        ...dataToSubmit.personalDetails,
        ...dataToSubmit.jobDetails
      };

      console.log('Submitting application data:', combinedData);

      const result = await jobApplicationApi.createApplication(combinedData, token || undefined);
      console.log('Job application submitted successfully:', result);
      
      localStorage.setItem('currentApplicationId', result.application._id);
      
      return result;
    } catch (error) {
      console.error('Error submitting job application:', error);
      throw error;
    }
  };

  const value: JobApplicationContextType = {
    applicationData,
    updatePersonalDetails,
    updateJobDetails,
    resetApplication,
    submitApplication
  };

  return (
    <JobApplicationContext.Provider value={value}>
      {children}
    </JobApplicationContext.Provider>
  );
};