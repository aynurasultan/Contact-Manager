import React from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { LiaTrashAlt } from "react-icons/lia";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Card = ({ item, onDelete, onEdit }) => {
  return (
    <div className="card">
      <div className="buttons">
        <button onClick={() => onEdit(item)}>
          <RiEdit2Fill />
        </button>
        <button onClick={() => onDelete(item.id)}>
          <LiaTrashAlt />
        </button>
      </div>
      <h1>{item.name[0]}{item.surname[0]}</h1>
      <h3>
      {item.name} {item.surname}
      </h3>
      <p>{item.position}</p>
      <p>{item.company}</p>

      <div className="bottom">
        <div>
          <span><FaPhone /></span>
          <span>{item.phone}</span>
        </div>
        <div>
          <span><MdEmail /></span>
          <span>{item.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
