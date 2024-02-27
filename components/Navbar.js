import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-white py-3 py-md-2 shadow-navbar mb-3">
      <div className="container-fluid justify-content-start">
        <Link href="/" className="logo">
          <img
            src="/baliyo-logo-1.svg"
            alt="Dolphy logo"
            className="img-fluid"
          />
        </Link>
        <button
          className="navbar-toggler d-lg-none ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <img
            loading="lazy"
            src="https://img.icons8.com/material-two-tone/24/000000/menu.png"
            width="24px"
            height="24px"
            alt="Navbar toggler icon"
          />
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0 align-items-center align-items-md-center">
            <li className="nav-item dropdown dropdown-fullwidth">
              <button
                className="nav-link dropdown-toggle align-items-center d-flex shadow-lg fw-500 text-dark me-3 px-2"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                Services
                <img
                  src="/dropdown.svg"
                  alt="dropdown icon"
                  className="img-fluid dropdown-nav-icon ms-1"
                />
              </button>
              <div
                className="dropdown-menu dropdown-menu-end border-0 show"
                data-bs-popper="static"
              >
                <div className="row p-3 pt-2 dopp">
                  <div className="col-12 col-sm-6 col-md-3 mb-3">
                    <Link
                      className="link-black"
                      href={`/pre-construction-homes/`}
                    >
                      <h5 className="mb-2 fw-mine fs-m">Product Development</h5>
                    </Link>
                    <ul className="list-unstyled">
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Yachu Factory Setup
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Drainage Bot
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Ward Robot
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Sister Robot
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Potter Wheel
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 mb-3">
                    <Link
                      className="link-black"
                      href={`/pre-construction-homes/`}
                    >
                      <h5 className="mb-2 fw-mine fs-m">Baliyo Architecture</h5>
                    </Link>
                    <ul className="list-unstyled">
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Griham restaurant
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Thankot Mart
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Tesla Showroom
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Residence [ Thecho ]
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Birta Expo
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 mb-3">
                    <Link
                      className="link-black"
                      href={`/pre-construction-homes/`}
                    >
                      <h5 className="mb-2 fw-mine fs-m">Baliyo Software</h5>
                    </Link>
                    <ul className="list-unstyled">
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Homebaba
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          ESAN
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          HikingBees
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Restaurant Management
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href="#"
                        >
                          Consultancy Management
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 mb-3">
                    <Link
                      className="link-black"
                      href={`/pre-construction-homes/`}
                    >
                      <h5 className="mb-2 fw-mine fs-m">Baliyo Marketing</h5>
                    </Link>
                    <ul className="list-unstyled">
                      <li>
                        <Link
                          className="dropdown-item link-black text-limit"
                          href={`/pre-construction-homes`}
                        >
                          Yachu Hair Oil
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12">
                    <div
                      className="alert alert-success bg-lightyellow alert-dismissible fade show mt-2 mb-0 rounded-3 d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row justify-content-start align-items-start gap-3"
                      role="alert"
                    >
                      <div>
                        <div className="my-2 my-sm-0 d-flex text-dark align-items-center gap-2">
                          <img
                            src="/COA-agent-pic.png"
                            alt="agent pic"
                            className="img-fluid img-call-height-dropdown"
                          />
                          <div className="d-flex flex-column justify-content-start align-items-start">
                            <p className="mb-0 fw-bold">
                              Looking for a tech solution in Nepal ?
                            </p>
                            <p className="fs-small mb-0">
                              Call us at
                              <Link
                                href={"telto:(587) 887-2572"}
                                className="me-2 ms-1"
                              >
                                9866316114
                              </Link>
                              to speak with our friendly tech advisor.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link className="btn btn-white link-black" href={"/"}>
                        Explore Baliyo Portfolio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                Research and Development
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/blogs">
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#mycontact" className="nav-link">
                Contact
              </Link>
            </li>
            <li className="nav-item d-flex flex-column">
              <Link
                href="tel:5878872572"
                className="btn my-2 my-sm-0 ms-md-3 d-flex text-dark gap-1"
              >
                <img
                  src="/COA-agent-pic.png"
                  alt="agent pic"
                  className="img-fluid img-call-height"
                />
                <span
                  className="d-flex flex-column justify-content-start utility__phone-msg"
                  id="utility__phone-msg"
                >
                  <b id="utility__phone-number text-dark">(+977) 9866316114</b>
                  <span className="d-block travel__expert fs-vsmall">
                    Speak to a technology expert
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
