import React, { useState } from "react";

const CustomerStories = () => {
  const stories = [
    {
      text: "Curabitur pharetra sapien quis purus scelerisque, sit amet pharetra ligula maximus.",
      author: "John Doe, CEO Alpha Beta Group",
    },
    {
      text: "Duis et elit tristique lacus auctor placerat. Aenean ac porta mauris. Maecenas et mi id tortor ultricies dictum.",
      author: "Jane Smith, Founder XYZ Inc.",
    },
    {
      text: "Phasellus volutpat quam vel purus auctor, id suscipit risus malesuada. Nulla facilisi.",
      author: "Alice Johnson, Marketing Head",
    },
    {
      text: "Suspendisse potenti. Nulla ac risus non erat laoreet blandit. Sed convallis arcu at nisl suscipit, a consectetur odio viverra.",
      author: "Bob Lee, CTO Tech Solutions",
    },
    {
      text: "In fringilla, arcu non venenatis vehicula, arcu massa elementum justo, sed aliquam felis magna in mi.",
      author: "Emma Brown, COO Global Corp",
    },
    {
      text: "Vivamus bibendum, libero non malesuada pharetra, justo neque ullamcorper eros, vel tincidunt sapien ipsum non ex.",
      author: "Michael Green, Product Manager",
    },
  ];

  const storiesPerPage = 3; // Number of stories to show per page
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(stories.length / storiesPerPage);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // Calculate the stories to display for the current page
  const displayedStories = stories.slice(
    currentPage * storiesPerPage,
    (currentPage + 1) * storiesPerPage
  );

  return (
    <div className="relative ml-20 my-16 p-4 bg-gray-100 overflow-hidden">
      <h2 className="font-inter font-bold text-[30px] leading-[36px] text-[#212121] mr-10 text-center mb-4">
        Customer Stories
      </h2>
      <p className="font-inter font-light text-[20px] leading-[29px] text-[#212121] text-center mx-20 mb-6">
        Cras viverra blandit dolor at maximus. Sed vel iaculis mauris.
        Pellentesque lectus ex, sagittis a metus eu, sodales ultricies metus.
        Mauris maximus diam sit amet sem varius finibus.
      </p>

      {/* Customer Stories Section */}
      <div className="flex flex-row items-start overflow-hidden">
        {displayedStories.map((story, index) => (
          <div
            key={index}
            className="flex flex-col items-start p-[30px] gap-[20px] bg-[#D6D6D6] rounded-[10px] w-[513px] h-[239px] mr-4"
          >
            <p className="w-[453px] h-[115px] font-inter font-light text-[18px] leading-[29px] text-black">
              {story.text}
            </p>
            <div className="w-[131px] h-[44px] font-inter font-bold text-[16px] leading-[22px] text-black">
              {story.author}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-row items-start gap-[9px] mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`w-[16px] h-[16px] rounded-full ${index === currentPage ? "bg-[#F06419]" : "bg-[#6F6F6F]"}`}
            onClick={() => handlePageChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerStories;
