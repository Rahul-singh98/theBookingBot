// import React from 'react';
// import OwlCarousel from 'react-owl-carousel';

// const PartnerSection = () => {
//   return (
//     <section className="partner-sect py-24">
//       <div className="container mx-auto">
//         <OwlCarousel
//           className="owl-theme"
//           loop
//           margin={30}
//           autoplay
//           autoplayTimeout={1000}
//           items={6}
//           responsive={{
//             0: { items: 1 },
//             768: { items: 3 },
//             1024: { items: 6 }
//           }}
//         >
//           {["p1.png", "p2.png", "p3.png", "p4.png", "p5.png"].map((img, idx) => (
//             <div key={idx} className="item">
//               <img src={`assets/images/${img}`} alt="partner-logo" />
//             </div>
//           ))}
//         </OwlCarousel>
//       </div>
//     </section>
//   );
// };

// export default PartnerSection;





// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css'; 
// import 'slick-carousel/slick/slick-theme.css';

// const PartnerSection = () => {
//   const settings = {
//     infinite: true,
//     slidesToShow: 6,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 1000,
//     responsive: [
//       { breakpoint: 1024, settings: { slidesToShow: 6 }},
//       { breakpoint: 768, settings: { slidesToShow: 3 }},
//       { breakpoint: 0, settings: { slidesToShow: 1 }}
//     ]
//   };

//   return (
//     <section className="partner-sect py-24">
//       <div className="container mx-auto">
//         <Slider {...settings}>
//         {["p1.png", "p2.png", "p3.png", "p4.png", "p5.png"].map((img, idx) => (
//             <div key={idx} className="item">
//               <img src={`assets/images/${img}`} alt="partner-logo" />
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </section>
//   );
// };

// export default PartnerSection;




import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

import Image1 from '@/assets/images/p1.png';
import Image2 from '@/assets/images/p2.png';
import Image3 from '@/assets/images/p3.png';
import Image4 from '@/assets/images/p4.png';
import Image5 from '@/assets/images/p5.png';

const PartnerSection = () => {
  const settings = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 6 }},
      { breakpoint: 768, settings: { slidesToShow: 3 }},
      { breakpoint: 0, settings: { slidesToShow: 1 }}
    ]
  };

  const images = [Image1, Image2, Image3, Image4, Image5];

  return (
    <section className="partner-sect py-24">
      <div className="container mx-auto">
        <Slider {...settings}>
          {images.map((img, idx) => (
            <div key={idx} className="item">
              <img src={img} alt={`partner-logo-${idx + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PartnerSection;
