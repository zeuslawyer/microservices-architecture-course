import { PostCreate } from "./PostCreate";
import { PostList } from "./PostList";
import React from "react";

export const App = () => {
  return (
    <div className="container">
      <h1>CREATE A POST</h1>
      <PostCreate />
      <hr />
      <h1>Post List</h1>
      <PostList />
    </div>
  );
};
