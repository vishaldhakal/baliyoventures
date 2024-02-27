import React from "react";

const Process = () => {
  return (
    <section className="py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row gy-5 gy-lg-0 align-items-center">
          <div className="col-12 col-lg-6">
            <img
              className="img-fluid rounded"
              loading="lazy"
              src="/process-img.png"
              alt=""
            />
          </div>
          <div className="col-12 col-lg-6">
            <div className="row justify-content-xl-end">
              <div className="col-12 col-xl-11">
                <h2 className="h1 mb-3">Our Working Process</h2>
                <p className="lead fs-4 text-secondary mb-5">
                  Our approach is very organized to ensure satisfaction for our
                  esteemed clients.
                </p>
                <div className="d-flex mb-4">
                  <div>
                    <span className="btn btn-dark bsb-btn-circle pe-none me-4">
                      1
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-3">Finalize Requirement</h4>
                    <p className="mb-0 text-secondary">
                      Etiam facilisis, erat ac ullamcorper dictum, nulla erat
                      pretium erat, ac tempus ligula sem ac erat.
                    </p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div>
                    <span className="btn btn-dark bsb-btn-circle pe-none me-4">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-3">Plan and Review</h4>
                    <p className="mb-0 text-secondary">
                      Etiam facilisis, erat ac ullamcorper dictum, nulla erat
                      pretium erat, ac tempus ligula sem ac erat.
                    </p>
                  </div>
                </div>
                <div className="d-flex">
                  <div>
                    <span className="btn btn-dark bsb-btn-circle pe-none me-4">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-3">Build and Deploy</h4>
                    <p className="mb-0 text-secondary">
                      Etiam facilisis, erat ac ullamcorper dictum, nulla erat
                      pretium erat, ac tempus ligula sem ac erat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
