import React from "react";

interface TitlePageProps {
  coverImage: string;
  title: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ coverImage, title }) => {
  const titlePageStyle: React.CSSProperties = {
    backgroundImage: `url(${coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "500px",
    width: "500px",
    textAlign: "center" as const,
    lineHeight: "500px",
    fontSize: "18px",
    color: "black",
  };

  return (
    <div data-density="hard" className="title-page" style={titlePageStyle}>
      {title}
    </div>
  );
};

export default TitlePage;

