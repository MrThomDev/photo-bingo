import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { toast, Slide } from "react-toastify";

import { APIContext } from "../../contexts/api.context";

import styles from "./newCard.style.module.css";

const NewCard = () => {
  const [name, setName] = useState("");
  const [nameLength, setNameLength] = useState("");
  const navigate = useNavigate();
  const { makeCard } = useContext(APIContext);

  const serverToClientName = () => {
    const serverSafeName = name.trim().replaceAll(" ", "_");

    return serverSafeName;
  };

  const handleChange = (event) => {
    if (event.target.value.length > 30) {
      return;
    }
    const regex = /^[a-zA-Z0-9 ]*$/;

    if (!regex.test(event.target.value)) {
      return;
    }
    setName(event.target.value);
    setNameLength(event.target.value.length);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length === 0) {
      console.error("No name entered");
      toast.error(
        "Cards must have a name. Please enter a name. The name may only contain letters, numbers, and spaces.",
        {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          transition: Slide,
          style: {
            backgroundColor: "#bc002d",
            color: "white",
            fontSize: "1.6rem",
          },
          progressStyle: {
            background: "linear-gradient(to right, #e68600, #ff9500, #ffa01a)",
          },
        }
      );
      return;
    }
    const serverName = serverToClientName(name);
    try {
      const { success, payload: cardResponse } = await makeCard(serverName);

      if (success) {
        navigate(`/list/${serverName}`);
      }
      if (success === false) {
        toast.error(
          `New card was not created. Server responded with a failure message. Error: "${cardResponse}"`,
          {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Slide,
            style: {
              backgroundColor: "#bc002d",
              color: "white",
              fontSize: "1.6rem",
            },
            progressStyle: {
              background:
                "linear-gradient(to right, #e68600, #ff9500, #ffa01a)",
            },
          }
        );
        throw new Error(cardResponse);
      }
    } catch (error) {
      console.error(error);
    }
    setName("");
    setNameLength(0);
  };
  return (
    <div className={`${styles[`new-card-container`]}`}>
      <p className={`${styles[`form-text`]}`}>New Card Name</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="nameInput"
          placeholder="Enter name"
          value={name}
          onChange={handleChange}
        />
      </form>
      <p className={`${styles[`char-limit`]}`}>{`${nameLength}`} / 30 </p>
      <button className={`${styles[`btn`]}`} onClick={handleSubmit}>
        submit
      </button>
    </div>
  );
};

export default NewCard;
