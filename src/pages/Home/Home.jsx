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

  const [user, setUser] = useState(null);
  const [AllNotes, setAllNotes] = useState([]);
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

  const getAllNotes = async () => {
    try {
      const response = await axiosinstance.get("/get-all-notes");
      setAllNotes(response.data.notes);
      console.log(response.data.notes);
    } catch (error) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);
  return (
    <div className="text-red-300">
      <Navbar user={user} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {AllNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={new Date(item.createdOn).toLocaleDateString()} // Convert createdOn to a readable date format
              content={item.content}
              tags={item.tags.join(" #")} // Convert tags array to a string
              isPinned={item.isPinned}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          ))}
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
        <AddEditNotes
          type={openAddeditNotesModel.type}
          noteData={openAddeditNotesModel.data}
          onClose={() => {
            setopenAddeditNotesModel({
              isShown: true,
              type: "add",
              data: null,
            });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </div>
  );
}

export default Home;
