import react from "react";
import AddPatient from "../AddComponents/AddPatient";

const CreatePatient = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">  
        {/* Header */}  
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Patient
          </h1>
        </div>  
        <div className="mb-8">
          <AddPatient />
        </div>
    </div>  
  )}

  export default CreatePatient;