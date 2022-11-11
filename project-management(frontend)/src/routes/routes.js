import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoutes";
import ProjectStatusIndex from "../pages/projectStatus";
import ProjectNameIndex from "../pages/projectName";
import ProjectIndex from "../pages/project";

// ===============================================================
// ADMIN
// ===============================================================

const Router = ({ children, ...rest }) => {
  // useEffect(() => {
  //   getUserLoggedIn()
  //   console.log(user.email)

  // }, []);
  return (
    <Routes>
      {/* {user.email == "admin@admin.com" ? ( */}
      <>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
            <Route path="/project" element={<ProjectIndex />} />
            <Route path="/projectName" element={<ProjectNameIndex />} />
            <Route path="/projectStatus" element={<ProjectStatusIndex />} />
        </Route>

        
      </>
      {/* ) : (
        <>
          <Route path="admin/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="places" element={<WebPlacesIndex />} />
          <Route path="category/:slug" element={<CategoryShow />} />
          <Route path="places/:slug" element={<PlaceShow />} />
          <Route path="places/:slug/direction" element={<WebPlaceDirection />} />
          <Route path="maps" element={<WebMapsIndex />} />
          <Route path="search" element={<WebSearchIndex />} />
        </>
      )} */}
    </Routes>
  );
};

export default Router;
