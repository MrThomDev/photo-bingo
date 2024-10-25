//This component it unique in that it is mean to be seen at all times. Because of this we use the Fragment and Outlet components from React. In essence, the navigation bar renders and then where the Outlet component is, whatever the endpoint (the Route found in App.js) is rendered in it's place. This way the NavBar is always at the top of the screen.

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
