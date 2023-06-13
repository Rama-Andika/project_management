import { Link, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {AiOutlineDatabase} from 'react-icons/ai'
import {AiOutlineUser} from 'react-icons/ai'
import {AiOutlineFileDone} from 'react-icons/ai'
import {GrNotes} from 'react-icons/gr'
import {AiOutlineProject} from 'react-icons/ai'

const SidebarComponent = () => {
  const location = useLocation();

  // destructing pathname from location
  const { pathname } = location;

  const splitLocation = pathname.split("/");

  return (
    <div className="list-group list-group-flush ">
      <Sidebar >
        <Menu>
          <MenuItem icon=<AiOutlineProject/> routerLink={<Link to="/project" />} active={splitLocation[1] === "project" ? true : false}>
            Project
          </MenuItem>
          <SubMenu icon=<AiOutlineDatabase/> label="Data Master" defaultOpen={splitLocation[1] === "projectName" || "projectStatus" || "user" ? true : false}>
            <MenuItem icon=<GrNotes/> routerLink={<Link to="/projectName" />} active={splitLocation[1] === "projectName" ? true : false}>
              Project Name
            </MenuItem>
            <MenuItem icon=<AiOutlineFileDone/> routerLink={<Link to="/projectStatus" />} active={splitLocation[1] === "projectStatus" ? true : false}>
              Project Status
            </MenuItem>
            <MenuItem icon=<AiOutlineUser/> routerLink={<Link to="/user" />} active={splitLocation[1] === "user" ? true : false}>
              Users
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
