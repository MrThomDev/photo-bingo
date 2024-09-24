import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import BackIcon from "../../icons/back.icon";

import styles from "./backBtn.style.module.css";

const BackArrow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === `/`;

  const handleBackClick = () => {
    navigate(-1);
  };

  return !isHomePage ? (
    <button
      className={styles[`btn`]}
      onClick={handleBackClick}
      aria-label="Go back"
    >
      <BackIcon className={styles[`back-icon`]} />
    </button>
  ) : null;
};

export default BackArrow;
