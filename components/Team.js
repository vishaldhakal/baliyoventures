import React from "react";

const Team = () => {
  return (
    <section className="py-3 py-md-5 py-xl-8">
      <div className="row justify-content-md-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
          <h2 className="display-5 text-center fs-1 main-title">Our Team</h2>
          <p className="mb-5 text-center lead fs-4">
            Group of <strong className="text-mine2">Innovative</strong> -{" "}
            <strong className="text-mine2">Experienced</strong> -{" "}
            <strong className="text-mine2">Proficient</strong>
          </p>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 gy-4 gy-lg-0 gx-xxl-3">
          <div className="col">
            <div className="card border-0 border-bottom border-warning shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                  <img
                    className="img-fluid"
                    loading="lazy"
                    src="baliyoadvantage/1.jpeg"
                    alt=""
                  />
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Dipawoli Malla</h4>
                    <p className="text-secondary mb-0">CEO</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card border-0 border-bottom border-warning shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                  <img
                    className="img-fluid"
                    loading="lazy"
                    src="baliyoadvantage/1.jpeg"
                    alt=""
                  />
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Anil Singh</h4>
                    <p className="text-secondary mb-0">Managing Director</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card border-0 border-bottom border-warning shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                  <img
                    className="img-fluid"
                    loading="lazy"
                    src="baliyoadvantage/1.jpeg"
                    alt=""
                  />
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Prithvi Chaudhary</h4>
                    <p className="text-secondary mb-0">
                      Product Development Head
                    </p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card border-0 border-bottom border-warning shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                  <img
                    className="img-fluid"
                    loading="lazy"
                    src="baliyoadvantage/1.jpeg"
                    alt=""
                  />
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Manav Khadka</h4>
                    <p className="text-secondary mb-0">IOT & Automation Head</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card border-0 border-bottom border-warning shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <figure className="m-0 p-0">
                  <img
                    className="img-fluid"
                    loading="lazy"
                    src="baliyoadvantage/1.jpeg"
                    alt=""
                  />
                  <figcaption className="m-0 p-4">
                    <h4 className="mb-1">Vishal Dhakal</h4>
                    <p className="text-secondary mb-0">
                      Software Development Head
                    </p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
