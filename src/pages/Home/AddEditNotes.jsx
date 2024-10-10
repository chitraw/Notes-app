import React, { useState } from "react";
import axiosinstance from "../../utils/axiosinstance";

function AddEditNotes({ noteData, type, getAllNotes, onClose }) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState(noteData?.tags || []);

  const handleAddTag = () => {
    if (tag.trim() !== "") {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const HandleNewNote = async () => {
    try {
      const response = await axiosinstance.post("add-note", {
        title,
        content,
        tags,
      });

      if (response.data) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Enter the note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title state
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          className="text-2xl text-slate-950 outline-none"
          placeholder="Enter the note content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)} // Update content state
        />
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <div className="mt-2">
          {tags.map((t, index) => (
            <div
              key={index}
              className="bg-slate-200 inline-flex items-center p-1 m-1 rounded">
              <span>{t}</span>
              <button
                className="ml-2 rounded-sm text-xl text-black"
                onClick={() => handleRemoveTag(index)}>
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="text-xl text-slate-950 outline-none border border-black rounded m-1 px-2"
            placeholder="Add a tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)} // Update tag state
          />
          <button
            className="font-medium text-[30px] p-1"
            onClick={handleAddTag}>
            +
          </button>
        </div>
      </div>
      <button
        className="bg-blue-600 font-medium w-full mt-5 p-3"
        onClick={HandleNewNote}>
        ADD
      </button>
    </div>
  );
}

export default AddEditNotes;
