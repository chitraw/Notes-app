import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-blue-600" : "text-Pink-900"}`} // Update here
          onClick={onPinNote}
        />
      </div>
      <p className="mt-2">{content ? content.slice(0, 60) : ""}</p>
      <div className="mt-2">
        <div className="text-xs text-slate-500">{tags}</div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
        <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
      </div>
    </div>
  );
};

export default NoteCard;
