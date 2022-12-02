import { Link, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

const SidebarComponent = () => {
  const location = useLocation();

  // destructing pathname from location
  const { pathname } = location;

  const splitLocation = pathname.split("/");

  return (
    <div className="list-group list-group-flush ">
      <Sidebar >
        <Menu>
          <MenuItem routerLink={<Link to="/project" />} active={splitLocation[1] === "project" ? true : false}>
            Project
          </MenuItem>
          {/* <MenuItem routerLink={<Link to="/projectDetail" />} active={splitLocation[1] === "projectDetail" ? true : false}>
          Project Detail
        </MenuItem> */}
          <SubMenu label="Data Master" defaultOpen={splitLocation[1] === "projectName" || "projectStatus" || "user" ? true : false}>
            <MenuItem routerLink={<Link to="/projectName" />} active={splitLocation[1] === "projectName" ? true : false}>
              Project Name
            </MenuItem>
            <MenuItem routerLink={<Link to="/projectStatus" />} active={splitLocation[1] === "projectStatus" ? true : false}>
              Project Status
            </MenuItem>
            <MenuItem routerLink={<Link to="/user" />} active={splitLocation[1] === "user" ? true : false}>
              Users
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
