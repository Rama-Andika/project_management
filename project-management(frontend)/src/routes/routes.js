import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoutes";
import ProjectStatusIndex from "../pages/projectStatus";
import ProjectNameIndex from "../pages/projectName";
import ProjectIndex from "../pages/project";
import ProjectCreate from "../pages/project/ProjectCreate";
import UsersIndex from "../pages/users";
import ProjectEdit from "../pages/project/ProjectEdit";

// ===============================================================
// ADMIN
// ===============================================================

const Router = ({ children, ...rest }) => {
  return (
    <Routes>
      <>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/project" element={<ProjectIndex />} />
          <Route path="/projectCreate" element={<ProjectCreate />} />
          <Route path="/projectEdit/:id" element={<ProjectEdit />} />
          <Route path="/user" element={<UsersIndex />} />
          <Route path="/projectName" element={<ProjectNameIndex />} />
          <Route path="/projectStatus" element={<ProjectStatusIndex />} />
        </Route>
      </>
    </Routes>
  );
};

export default Router;
