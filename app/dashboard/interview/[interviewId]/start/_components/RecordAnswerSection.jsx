"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  isAudioPlaying,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null); // Reference to control the video playback

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  useEffect(() => {
    if (videoRef.current && isAudioPlaying) {
      videoRef.current.src = "/Speeking.mp4";
      videoRef.current.play();
    }
  }, [isAudioPlaying]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer, "########");
    setLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer:" +
      userAnswer +
      ",Depends on question and user answer for given interview question " +
      " please give use rating for answer and feedback as area of improvement if any" +
      " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
    console.log(
      "🚀 ~ file: RecordAnswerSection.jsx:38 ~ SaveUserAnswer ~ feedbackPrompt:",
      feedbackPrompt
    );
    const result = await chatSession.sendMessage(feedbackPrompt);
    console.log(
      "🚀 ~ file: RecordAnswerSection.jsx:46 ~ SaveUserAnswer ~ result:",
      result
    );
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    console.log(
      "🚀 ~ file: RecordAnswerSection.jsx:47 ~ SaveUserAnswer ~ mockJsonResp:",
      mockJsonResp
    );
    const JsonfeedbackResp = JSON.parse(mockJsonResp);
    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonfeedbackResp?.feedback,
      rating: JsonfeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (resp) {
      toast("User Answer recorded successfully");
      setUserAnswer("");
      setResults([]);
    }
    setResults([]);
    setLoading(false);
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center p-5 my-20 rounded-lg bg-stone-100">
        {/* Video playback element */}
        {isAudioPlaying ? (
          // Render video when audio is playing
          <video
            ref={videoRef}
            src="/Speaking.mp4"
            loop
            muted
            className="w-72 h-72"
            autoPlay
          />
        ) : (
          // Render poster when audio is not playing
          <img
            src="/poster.jpg" // Replace with the path to your poster image
            alt="Poster"
            className="w-72 h-72"
          />
        )}
      </div>
      <Button
        disabled={loading || isAudioPlaying} // Disable button when audio is playing
        variant="outline"
        className={`my-10 ${
          isAudioPlaying ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
        }`} // Add greyed-out effect
        onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="flex items-center gap-2 text-red-600 animate-pulse">
            <StopCircle /> Stop Recording...
          </h2>
        ) : (
          <h2 className="flex items-center gap-2 text-primary">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
