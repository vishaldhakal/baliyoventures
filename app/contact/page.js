import BottomContactForm from "@/components/BottomContactForm";

export default function Contact() {
  return (
    <>
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
