import BaliyoAdvantage from "@/components/BaliyoAdvantage";
import BottomContactForm from "@/components/BottomContactForm";
import ProjectCard from "@/components/ProjectCard";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <>
      <div className="container-fluid">
        <div className="row row-cols-1 row-cols-md-2 align-items-center pb-1 pt-1">
          <div className="col">
            {/* <h1 className="fw-bold fs-big">Baliyo Ventures</h1> */}
            <img
              src="/baliyotext.svg"
              alt="baliyo venture"
              className="img-fluid baliyo"
            />
            <h1 className="main-title">Providing expertise and solution in </h1>
            <h5 className="fw-light bef-light display-inline">
              <span className="bg-white p-2 fs-s shadow">
                <span>
                  <img
                    src="/manufacturing.png"
                    alt="manufacturing"
                    className="img-fluid small-icon"
                  />
                </span>{" "}
                Product Development
              </span>
              <span className="bg-white p-2 fs-s shadow ms-3">
                <span>
                  <img
                    src="/web-development.png"
                    alt="web-development"
                    className="img-fluid small-icon"
                  />
                </span>{" "}
                Software Development
              </span>
              <span className="bg-white p-2 fs-s shadow ms-3">
                <span>
                  <img
                    src="/engineer.png"
                    alt="engineer"
                    className="img-fluid small-icon"
                  />
                </span>{" "}
                Architecture Design
              </span>
            </h5>
            <div className="my-5"></div>
            <p className="mt-3 mb-4">
              Whether you're a business looking for tech solutions or a
              professional aspiring to make a difference in the tech world, we
              invite you to join us on this exciting journey. We're not just
              building products; we're shaping the future of technology in
              Nepal.
            </p>
            <div className="d-flex">
              <button className="btn btn-lg bg-white shadow-lg">
                Discuss your project now
              </button>
              <button className="btn my-2 my-sm-0 ms-md-3 d-flex text-dark gap-1">
                <img
                  src="/COA-agent-pic.png"
                  alt="agent pic"
                  className="img-fluid img-call-height"
                />
                <span
                  className="d-flex flex-column justify-content-start"
                  id="utility__phone-msg"
                >
                  <b id="utility__phone-number text-dark">(+977) 9866316114</b>
                  <span className="d-block travel__expert fs-vsmall text-dark">
                    Speak to a technology expert
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className="col">
            <img src="/hero.png" alt="baliyo team" className="img-fluid" />
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="py-5"></div>
        <div>
          <h2 className="text-center fw-bold fs-1 mb-4">
            Not Flexing, but just look at our Clients
          </h2>
          <div className="d-flex justify-content-start">
            <img src="/downarrw.png" alt="sdvf" className="img-fluid" />
          </div>
          <img
            src="/www.png"
            alt="our client"
            className="img-fluid w-100 px-md-5"
          />
        </div>
        <div className="py-5"></div>
      </div>
      <div className="py-5"></div>
      <div className="container-fluid">
        <h2 className="text-center fw-bold fs-1">
          Big Client names and no projects. No, Not at Baliyo
        </h2>
        <p className="text-center mb-4">
          Explore our wide range of projects and see how we have helped our
          clients to achieve their goals.
        </p>
        <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5 gy-4 gx-3 gx-lg-2">
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
          <div className="col">
            <ProjectCard></ProjectCard>
          </div>
        </div>
        <div className="py-5"></div>
        <BaliyoAdvantage></BaliyoAdvantage>
        <div className="py-5"></div>
      </div>
      <div className="container py-4">
        <Testimonial></Testimonial>
      </div>
      <div className="container">
        <div className="py-5 my-5" id="mycontact">
          <div className="container-fluid2">
            <div className="row justify-content-center">
              <img
                src="/cb.png"
                alt="dce"
                className="img-fluid w-25 w-smm-50 mb-3"
              />
            </div>
            <h2 className="fw-mine text-center px-md-4 pb-3 fs-3">
              Contact Baliyo Ventures Today
            </h2>
            <div className="row row-cols-1 row-cols-md-3 mt-3">
              <div className="col-md-2"></div>
              <div className="col-md-8 px-lg-5">
                <BottomContactForm
                  proj_name="All"
                  city="Home Page"
                ></BottomContactForm>
              </div>
              <div className="col-md-2"></div>
            </div>
          </div>
        </div>
        <div className="py-5 my-5"></div>
      </div>
    </>
  );
}
