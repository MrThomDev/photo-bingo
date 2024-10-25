import { Routes, Route } from "react-router-dom";
import NavBar from "./routes/navigation/navBar.route";
import Home from "./routes/home/home.route";
import DisplayList from "./routes/displayList/displayList.route";
import ImageGallery from "./routes/imageGrid/imageGallery.component";
import NewCard from "./routes/newCard/newCard.route";
import DeleteLists from "./routes/deleteLists/deleteLists.route";

//The App component establishes the basic structure and endpoints for the front end. All of the components found here can be found in the "routes" folder.

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route
          path="/display/card/:cardType/:cardName"
          element={<DisplayList />}
        />
        <Route path="/images/grid/:index" element={<ImageGallery />} />
        <Route path="/newCard" element={<NewCard />} />
        <Route path="deleteLists" element={<DeleteLists />} />
      </Route>
    </Routes>
  );
}

export default App;
