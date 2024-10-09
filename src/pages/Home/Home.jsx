import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Card/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";

import axiosinstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [openAddeditNotesModel, setopenAddeditNotesModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [user, setUser] = useState(null); // State to store user data
  console.log(axiosinstance);
  useEffect(() => {
    // Define a function to fetch user data
    const getUser = async () => {
      try {
        const response = await axiosinstance.get("/get-users");
        setUser(response.data); // Assuming response.data contains user info
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    // Call the function to fetch user data on component mount
    getUser();
  }, []);
  return (
    <div className="text-red-300">
      <Navbar user={user} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Meeting on 7th April"
            date="3rd Apr 2024"
            content="Meeting on 7th April Meeting on 7th April"
            tags="#Meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
      <button
        className="w-16 flex item-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-900 absolute right-10 bottom-10 p-4"
        onClick={() => {
          setopenAddeditNotesModel({
            isShown: true,
            type: "add",
            data: null,
          });
        }}>
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddeditNotesModel.isShown}
        onRequestClose={() => setopenAddeditNotesModel({ isShown: false })}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 "
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}>
        <AddEditNotes />
      </Modal>
    </div>
  );
}

export default Home;
