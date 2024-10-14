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
  const [searchQuery, setSearchQuery] = useState(false); // State for search query
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosinstance.get("/get-users");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    getUser();
  }, []);

  const getAllNotes = async () => {
    try {
      const response = await axiosinstance.get("/get-all-notes");
      setAllNotes(response.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  const handleEditNote = (note) => {
    setopenAddeditNotesModel({
      isShown: true,
      type: "edit",
      data: note, // Pass the current note data to the modal
    });
  };

  const handleDeleteNote = async (noteId) => {
    console.log(noteId);
    try {
      const response = await axiosinstance.delete("/delete-note/" + noteId);

      if (response.data) {
        getAllNotes();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handlePinNote = async (noteId) => {
    console.log("Note ID:", noteId);
    try {
      const response = await axiosinstance.put("/pin-note/" + noteId, {
        isPinned: noteId, // Toggle the isPinned status
      });

      if (response.data) {
        getAllNotes(); // Refresh the list after pinning/unpinning
      }
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axiosinstance.get(
        `/search-notes?query=${searchQuery}`
      );
      if (!response.data.error) {
        setSearchQuery(true);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };
  return (
    <div className="text-red-300">
      <Navbar user={user} onSearchNote={handleSearch} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {AllNotes.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={new Date(item.createdOn).toLocaleDateString()}
              content={item.content}
              tags={item.tags.join(" #")}
              isPinned={item.isPinned}
              onEdit={() => handleEditNote(item)}
              onDelete={() => handleDeleteNote(item._id)}
              onPinNote={() => handlePinNote(item._id)}
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
              isShown: false,
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
