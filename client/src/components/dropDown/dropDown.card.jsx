import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import { CSSTransition } from "react-transition-group";

import ChevronDownIcon from "../../icons/chevronDown.icon";

import styles from "./dropDown.style.module.css";

const DropDownCard = ({ cardType, typeNames }) => {
  const [isOpen, setIsOpen] = useState(false);

  const nodeRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles[`drop-down-card-container`]}>
      <div className={styles["type-title-icon-container"]} onClick={toggleOpen}>
        <h2 className={styles[`card-type`]}>{cardType}</h2>
        <ChevronDownIcon
          className={`${styles[`chevron-down`]} ${
            isOpen ? styles[`open`] : styles[`closed`]
          } `}
        />
      </div>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames={{
          enter: styles["dropdown-enter"],
          enterActive: styles["dropdown-enter-active"],
          exit: styles["dropdown-exit"],
          exitActive: styles["dropdown-exit-active"],
        }}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <ul className={`name-container`} ref={nodeRef}>
          {typeNames.map((name, index) => (
            <li className={styles[`card-name`]} key={`${index}-${name}`}>
              <Link to={`/display/card/${cardType}/${name}`}>
                {name.replaceAll("_", " ")}
              </Link>
            </li>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
};

export default DropDownCard;
