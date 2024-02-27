import BottomContactForm from "@/components/BottomContactForm";
import AboutUs from "@/components/AboutUs";
import FAQ from "@/components/FAQ";
import Team from "@/components/Team";

export default function About() {
  return (
    <>
      <div className="container-fluid">
        <AboutUs></AboutUs>
        <div className="py-3"></div>
        <div className="pb-5">
          <div className="d-flex justify-content-center">
            <img src="/focus.png" alt="" className="img-fluid" />
          </div>
          <div className="container-fluid">
            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 align-items-center">
              <div className="col">
                <img src="/services/5.png" alt="" className="img-fluid" />
              </div>
              <div className="col">
                <img src="/services/6.png" alt="" className="img-fluid" />
              </div>
              <div className="col">
                <img src="/services/7.png" alt="" className="img-fluid" />
              </div>
              <div className="col">
                <img src="/services/8.png" alt="" className="img-fluid" />
              </div>
              <div className="col">
                <img src="/services/9.png" alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
        <div className="py-3">
          <Team></Team>
        </div>
        <div className="py-3"></div>
        <FAQ></FAQ>
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
