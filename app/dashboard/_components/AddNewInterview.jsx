"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("For any job description experenced or fresher");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `Generate questions for HR Round. No.of Years of Experence: ${jobExperience} The question Count: ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT}
  {
    "question": "Your question here",
    "answer": "Your answer here"
  }
  The first question the question should greet the user and ask them to introduce themselves.
  The last question should be Thank you for attending do you have any questions.
  The questions generated should in asked in HR Round Interview.
  the response should be in valid json format. 
  `;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      console.log(
        "🚀 ~ file: AddNewInterview.jsx:41 ~ onSubmit ~ responseText:",
        responseText
      );
      const jsonMatch = responseText.match(/\[.*?\]/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON array found in the response");
      }

      const jsonResponsePart = jsonMatch[0];
      console.log(
        "🚀 ~ file: AddNewInterview.jsx:43 ~ onSubmit ~ jsonResponsePart:",
        jsonResponsePart
      );

      if (jsonResponsePart) {
        const mockResponse = JSON.parse(jsonResponsePart.trim());
        console.log(
          "🚀 ~ file: AddNewInterview.jsx:45 ~ onSubmit ~ mockResponse:",
          mockResponse
        );
        setJsonResponse(mockResponse);
        const jsonString = JSON.stringify(mockResponse);
        const res = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: jsonString,
            jobPosition: jobPosition,
            jobDesc: jobDescription,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });
        setLoading(false);
        router.push(`dashboard/interview/${res[0]?.mockId}`);
      } else {
        console.error("Error: Unable to extract JSON response");
      }
    } catch (error) {
      console.error("Error fetching interview questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 transition-all border rounded-lg cursor-pointer bg-secondary hover:scale-105 hover:shadow-md"
        onClick={() => setOpenDialog(true)}>
        <h1 className="text-lg font-bold text-center">+ Add New</h1>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tell us more about your job Interviewing
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <p>
                  Add details about your job position/role, job description, and
                  years of experience
                </p>
                <div className="my-3 mt-7">
                  <label>Intervie Name</label>
                  <Input
                    placeholder="Name the interview"
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div className="my-3">
                  <label>Years of Experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    min="1"
                    max="70"
                    required
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Generating from
                      AI
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
