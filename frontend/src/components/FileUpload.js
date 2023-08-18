import React from "react";

const FileUpload = ({ onUpload }) => {
  return <input type="file" onChange={onUpload} multiple />;
};

export default FileUpload;
