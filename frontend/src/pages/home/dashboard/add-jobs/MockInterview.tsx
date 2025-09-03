import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Circle,
  PhoneOff,
} from "lucide-react";
// Add the AlertDialog components to your imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MockInterview: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(true);
  const [interviewTime, setInterviewTime] = useState<number>(0);
  // Add a new state for the "End Interview" alert dialog
  const [openEndInterviewDialog, setOpenEndInterviewDialog] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setInterviewTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = (): void => {
    setIsRecording(!isRecording);
  };

  const toggleMic = (): void => {
    setIsMicActive(!isMicActive);
  };

  const toggleVideo = (): void => {
    setIsVideoActive(!isVideoActive);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-zinc-950 text-white flex flex-col">
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold">Mock Interview</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Time</span>
            <span className="text-xl font-semibold">{formatTime(interviewTime)}</span>
          </div>
          <Button 
            className={`rounded-full text-sm font-medium ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-700 hover:bg-zinc-600'}`}
            onClick={toggleRecording}
            size="sm"
          >
            {isRecording ? (
              <>
                <Circle className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                Recording
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main content area that expands */}
      <div className="flex-1 flex items-stretch p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
          {/* AI Interviewer Side */}
          <div className="flex flex-col rounded-lg border border-zinc-700 overflow-hidden bg-zinc-800">
            <div className="px-4 py-3 bg-zinc-750 border-b border-zinc-700">
              <h3 className="text-sm font-medium">AI Interviewer</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
                AI
              </div>
              <div className="text-lg font-medium">AI Interviewer</div>
              <div className="text-sm text-zinc-400 mt-1">Senior React Developer</div>
            </div>
          </div>

          {/* Your Side */}
          <div className="flex flex-col rounded-lg border border-zinc-700 overflow-hidden bg-zinc-800">
            <div className="px-4 py-3 bg-zinc-750 border-b border-zinc-700">
              <h3 className="text-sm font-medium">You</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
              {!isVideoActive && (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <VideoOff className="h-10 w-10 text-zinc-500 mb-2" />
                    <div className="text-zinc-400">Camera is off</div>
                  </div>
                </div>
              )}
              {isVideoActive && (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-zinc-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
                    Y
                  </div>
                  <div className="text-lg font-medium">Your Camera</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Taskbar at the bottom */}
      <div className="flex justify-center items-center gap-4 py-4 px-6 bg-zinc-900 border-t border-zinc-700">
        <Button
          variant={isMicActive ? "default" : "secondary"}
          onClick={toggleMic}
          className="rounded-full h-12 w-12 p-0"
        >
          {isMicActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant={isVideoActive ? "default" : "secondary"}
          onClick={toggleVideo}
          className="rounded-full h-12 w-12 p-0"
        >
          {isVideoActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button 
          className="rounded-full h-12 w-12 p-0 bg-red-600 hover:bg-red-700"
          // Change the onClick to open the dialog instead of navigating directly
          onClick={() => setOpenEndInterviewDialog(true)}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
        {/* The AlertDialog component is now here */}
        <AlertDialog open={openEndInterviewDialog} onOpenChange={setOpenEndInterviewDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Interview?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end the mock interview and view your analysis?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenEndInterviewDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate("/add-jobs/mock-interview-analysis")}>
                End Interview
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MockInterview;