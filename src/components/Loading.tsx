import React from "react";
import { BiLoader as LoaderIcon } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="h-screen w-full flex flex-col gap-3 items-center justify-center">
      <LoaderIcon className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
    </div>
  );
};

export default Loading;
