import React from "react";
import AddNewHire from "./AddNewHire";
import TaskList from "./TaskList";

function Dashboard({ user }) {
  return (
    <div>
      {user.role === "hr" && <AddNewHire />}
      <TaskList userId={user._id} />
    </div>
  );
}

export default Dashboard;
