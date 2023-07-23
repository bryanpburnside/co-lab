import React from "react";
interface Story {
  id?: number;
  title: string;
  coverImage: any | null;
  numberOfPages: number | null;
  originalCreatorId?: string | null;
  isPrivate: boolean;
  titleColor: string;
  collaborators: Array<string>
}

interface TitlePageProps {
  story: Story;
  addNewPage: () => void;
}

const TitlePage: React.FC<TitlePageProps> = ({ story, addNewPage }) => {

  return (
    <div
      style={{
        backgroundImage: `url(${story.coverImage || 'https://res.cloudinary.com/dhin8tgv1/image/upload/v1689349895/cgdztp7ma8eqxivjsd5r.png'})`,
        height: '100%',
        width: '500px',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Title */}
      <div
        style={{
          backgroundColor: 'transparent',
          height: '30px',
          maxWidth: 'calc(100% - 80px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 10px',
          color: story.titleColor,
          fontWeight: 'bolder',
          fontSize: '32px',
          textAlign: 'center',
          margin: 'auto',
          marginTop: '50px'
        }}
      >
        { story.title }
        </div>
    </div>
  );
};

export default TitlePage;
