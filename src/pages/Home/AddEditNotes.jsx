import React, { useState } from "react";

function AddEditNotes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  const handleAddTag = () => {
    if (tag.trim() !== "") {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  return (
    <div>
      <button>Close</button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="GO TO GYM AT 5"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Content"
          rows={10}
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
            onChange={(e) => setTag(e.target.value)}
          />
          <button
            className="font-medium text-[30px]   p-1 "
            onClick={handleAddTag}>
            +
          </button>
        </div>
      </div>
      <button
        className="bg-blue-600 font-medium w-full mt-5 p-3 "
        onClick={() => {}}>
        ADD
      </button>
    </div>
  );
}

export default AddEditNotes;
