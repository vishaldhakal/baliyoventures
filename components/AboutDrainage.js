import React from "react";

const AboutDrainage = () => {
  return (
    <section className="py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
          <div className="col-12 col-lg-6 col-xl-5">
            <img
              className="img-fluid rounded"
              loading="lazy"
              src="/baliyoadvantage/2.jpeg"
              alt=""
            />
          </div>
          <div className="col-12 col-lg-6 col-xl-7">
            <div className="row justify-content-xl-center">
              <div className="col-12 col-xl-11">
                <h2 className="fs-1 mb-3 main-title">Drainage Robot</h2>
                <p className="mb-3 text-mine2">
                  Providing Solutions For All Your Drainage Needs
                </p>
                <p className="mb-5">
                  Drainage Robot helps clean and maintain your drainage system
                  with ease. It is an innovative solution that helps you keep
                  your drainage system in top condition, preventing clogs and
                  other issues that can lead to costly repairs. With Drainage
                  Robot, you can rest assured that your drainage system is
                  functioning properly and efficiently, saving you time and
                  money in the long run.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDrainage;
