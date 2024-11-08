"use client";
import { Lightbulb, Volume2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex, setIsAudioPlaying }) => {
  const textToSpeach = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.onstart = () => setIsAudioPlaying(true);  // Set audio playing state to true when speech starts
      speech.onend = () => setIsAudioPlaying(false);   // Set audio playing state to false when speech ends
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };

  useEffect(() => {
    if (mockInterviewQuestion && mockInterviewQuestion[activeQuestionIndex]) {
      const currentQuestion = mockInterviewQuestion[activeQuestionIndex]?.question;
      textToSpeach(currentQuestion);
    }
    // Stop speech synthesis if the question is not active anymore.
    return () => {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);  // Reset audio playing state when question changes
    };
  }, [activeQuestionIndex, mockInterviewQuestion]);

  return mockInterviewQuestion && (
    <div className='p-5 my-10 border rounded-lg'>
      <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
        {mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index && 'bg-blue-700 text-white'}`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>
      <h2 className='my-5 text-md md:text-lg'>
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>
      <Volume2
        className='cursor-pointer'
        onClick={() => textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}
      />
      <div className='p-5 mt-20 bg-blue-100 border rounded-lg'>
        <h2 className='flex items-center gap-2 text-primary'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='my-2 text-sm text-primary'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
};

export default QuestionsSection;
