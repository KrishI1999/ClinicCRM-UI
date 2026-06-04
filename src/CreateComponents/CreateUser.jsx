import react from "react";
import AdddUser from "../AddComponents/AddUser";

const CreateUser = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">  
        {/* Header */}  
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create New User
          </h1>
        </div>  
        <div className="mb-8">
          <AdddUser />
        </div>
    </div>  
  )}

  export default CreateUser;