"use client"
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {ChevronsUpDown} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';



const Feedback = ({params}) => {
  const [feedbackList,setFeedbackList] = useState([]);
  const router = useRouter()
  useEffect(()=>{
    GetFeedback();
  },[])
  const GetFeedback=async()=>{
    const result = await db.select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef,params.interviewId))
    .orderBy(UserAnswer.id);
    console.log("🚀 ~ file: page.jsx:11 ~ GetFeedback ~ result:", result);
    setFeedbackList(result);
  }
  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-600'>Congratulations!</h2>
      <h2 className='text-2xl font-bold'>Here is your interview feedback</h2>
      {feedbackList?.length ==0 ?
      <h2 className='text-lg font-bold text-green-500'>No interview Feedback</h2>
      : <>
      
      <h2 className='text-sm text-gray-500'>Find below interview questions with coreect answers,Your answer and feedback for improvements for your next interview</h2>
      {feedbackList&&feedbackList.map((item,index)=>(
        <Collapsible key={index} className='mt-7'>
        <CollapsibleTrigger className='flex justify-between w-full p-2 my-2 text-left rounded-lg bg-secondary gap-7'>
        {item.question} <ChevronsUpDown className='h-4'/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className='flex flex-col gap-2'>
            <h2 className='p-2 text-red-500 border rounded-lg'>
              <strong>
                Rating:
              </strong>
              {item.rating}
            </h2>
            <h2 className='p-2 text-sm text-red-900 border rounded-lg bg-red-50'><strong>Your Answer: </strong>{item.userAns}</h2>
            <h2 className='p-2 text-sm text-green-900 border rounded-lg bg-green-50'><strong>Correct Answer Looks Like: </strong>{item.correctAns}</h2>
            <h2 className='p-2 text-sm border rounded-lg bg-blue-50 text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
          </div>
        </CollapsibleContent>
      </Collapsible>      
      ))}
      </>
      }
   <Button className='mt-5' onClick={()=>router.replace('/dashboard')}> Go Home</Button>
    </div>
  );
}

export default Feedback;
