import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const NavBar = ({ session }) => {
  const navigate = useNavigate();
  console.log(localStorage);
  return (
    <header className="sticky top-0 z-50 flex justify-between bg-white p-5 shadow-md md:px-10">
      <h1 className="text-bold">BODEGA SWAP</h1>
      {!session ? (
        <nav className="flex items-center justify-end space-x-4 text-gray-500">
          <Link to="/home">Home</Link>
          <Link to="login">Login</Link>
          <Link to="/items">View Items</Link>
        </nav>
      ) : (
        <nav className="flex items-center justify-end space-x-4 text-gray-500">
          <Link to="/home">Home</Link>

          <Link to="/profile">Profile</Link>

          <Link to="/messages">Messages</Link>
          <Link to="/account">My Account</Link>
          <Link to="/items">View Items</Link>
          <Link
            className="navLink"
            to="/"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate(`/home`);
            }}
          >
            Logout
          </Link>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
