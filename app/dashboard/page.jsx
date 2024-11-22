import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="w-full h-full ">
      <h2 className="text-2xl font-bold">dashboard</h2>
      <h2 className="text-gray-500">Create and Start Your AI Mockup Interview</h2>
      <div className="grid grid-cols-1 my-5 md:grid-cols-3">
        <AddNewInterview/>
      </div>
      {/* previous interview questions */}
      <InterviewList/>
    </div>
  );
};

export default Dashboard;
