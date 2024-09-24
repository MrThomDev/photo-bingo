import { Fragment } from "react";
import { Outlet, Link } from "react-router-dom";

import BackArrow from "../../components/backBtn/backBtn.component";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./navBar.style.module.css";

const NavBar = () => {
  return (
    <Fragment>
      <ToastContainer />
      <nav className={styles[`navigation-container`]}>
        <Link className={`${styles[`link`]}`} to="/">
          <h1 className={styles.header}>Home</h1>
        </Link>
      </nav>
      <BackArrow />
      <Outlet />
    </Fragment>
  );
};

export default NavBar;
