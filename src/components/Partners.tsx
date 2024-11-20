import React from "react";

const partnerLogos = [
  {
    src: "/kigali-fame.png",
    alt: "Future focus Academy",
    link: "https://futurefocus.co.rw",
  },
  {
    src: "/ppal.png",
    alt: "ARTIST SUMMER PROMOTION ",
    link: "https://aspromo.rw",
  },
  {
    src: "/spen.png",
    alt: "CISA - Cybersecurity and Infrastructure Security Agency",
    link: "https://www.cisa.gov",
  },
  {
    src: "/airtel.png",
    alt: "Fortinet Cybersecurity Partner",
    link: "https://www.fortinet.com",
  },
  
  {
    src: "/momo.png",
    alt: "Fortinet Cybersecurity Partner",
    link: "https://www.fortinet.com",
  },
  
  {
    src: "/visa.png",
    alt: "Fortinet Cybersecurity Partner",
    link: "https://www.fortinet.com",
  },
  
 
];

const PartnerLogos = () => {
  return (
    <div className="pt-10 mt-5 bg-[#232724]">
      <h1 className="text-gray-200 text-3xl font-bold text-center ">
            OUR PARTENERS
      </h1>
      <div
        className={`flex  flex-wrap justify-center gap-4 p-6 ${
          partnerLogos.length > 1 ? "grid-cols-2" : "grid-cols-1"
        }      mx-auto  w-fit md:${
          partnerLogos.length < 3
            ? `grid-cols-${partnerLogos.length}`
            : "grid-cols-5"
        }  lg:${
          partnerLogos.length < 5
            ? `grid-cols-${partnerLogos.length}`
            : "grid-cols-6"
        }`}
      >
        {partnerLogos.map((partner, index) => (
          <div
            key={index}
            className="justify-center gap-0 max-w-64   transform transition duration-300 hover:scale-105 cursor-pointer"
          >
            <a href={partner.link}>
              <img
                src={partner.src}
                alt={partner.alt}
                className="max-h-32  bg-white object-contain"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogos;
