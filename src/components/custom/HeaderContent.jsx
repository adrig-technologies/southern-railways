import React from "react";
import Image from "next/image";

const HeaderContent = ({ img, title, description }) => {
  const isSvg = typeof img === 'object' && img.type === 'svg';

  return (
    <section className="flex flex-col items-center space-y-4">
      <div className="w-full flex justify-center items-center space-x-4">
        <div className="w-14 h-14 flex items-center justify-center bg-slate-100 rounded-full shadow-md">
          {isSvg ? (
            img
          ) : (
            <Image
              src={img}
              alt={title}
              className="w-full h-full ml-1"
            />
          )}
        </div>
        <h1 className="text-2xl font-bold font-sans text-slate-800">
          {title}
        </h1>
      </div>
      <p className="w-full text-center text-md font-sans text-slate-600">
        {description}
      </p>
    </section>
  );
};

export default HeaderContent;
