import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://cliniccrm-kvlv.onrender.com/api/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPatient(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://cliniccrm-kvlv.onrender.com/api/patients/${id}`,
        patient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Patient updated successfully");
      navigate("/patients");
    } catch (error) {
      console.error(error);
      alert("Failed to update patient");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">
          Edit Patient
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={patient.name}
            onChange={handleChange}
            placeholder="Patient Name"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="age"
            value={patient.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full border rounded-lg p-3"
          />

          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="phone"
            value={patient.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-lg p-3"
          />

          <textarea
            name="address"
            value={patient.address}
            onChange={handleChange}
            rows="3"
            placeholder="Address"
            className="w-full border rounded-lg p-3"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Patient
            </button>

            <button
              type="button"
              onClick={() => navigate("/patients ",{ replace: true })}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatient;