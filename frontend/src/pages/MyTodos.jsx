import React from "react";
import Home from "./Home";

const MyTodos = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <Home userId={user.id} />
    </>
  );
};

export default MyTodos;
