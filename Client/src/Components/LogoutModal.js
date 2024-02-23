import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector  } from "react-redux";
import { logout } from "../Features/user"
import { useDispatch } from "react-redux";

const LogoutModal = ({ open, onClose }) => {
  // const [user, setUser] = useState("");
  // let userDetails = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  // let user = useSelector((state) => state.user.value);


  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     axios
  //       .post("http://localhost:3636/user/verify", {
  //         token: localStorage.getItem("token"),
  //       })
  //       .then(({ data }) => {
  //         //console.log(data);
  //         setUser(data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

  const logOut = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      dispatch(logout())

    }
  };

  if (!open) return null;
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="logout-modalContainer">
        <div className="logout-modal-poster-div">
          <img
            className="matrix-modal-poster"
            src={require("../images/maxresdefault.jpg")}
          />
        </div>

        <h3 class="title">Are you sure you want to log out? </h3>
        <div className="logout-buttons">
          <button
            className="logout-button yes"
            onClick={() => {
            logOut();
            }}
          >
            Yes
          </button>
          <button className="logout-button no" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
