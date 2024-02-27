import Link from "next/link";

const Footer = ({ cities }) => {
  return (
    <>
      <footer className="footer shadow-lg text-dark">
        <div className="container-fluid footer-top">
          <div className="row gy-4">
            <div className="col-lg-5 col-md-12 footer-about">
              <Link href="/" className="footer-logo d-flex align-items-center">
                <img
                  src="/baliyo-logo-1.svg"
                  alt="Baliyo Ventures logo"
                  className="img-fluid"
                />
              </Link>
              <p></p>
              <p>
                Baliyo Ventures is a technology company that provides solutions
                to all your technology needs. We provide services like product
                development, architecture design, software development and
                marketing. We are a team of experienced professionals who are
                dedicated to provide you the best services.
              </p>
              <div className="social-links d-flex mt-4">
                <Link href="#" className="me-2" target="_blank">
                  Facebook
                </Link>
                <Link href="#" className="me-2" target="_blank">
                  Instagram
                </Link>
                <Link
                  href="https://www.instagram.com/Baliyo Ventures_ca/"
                  className="me-2"
                  target="_blank"
                >
                  Linkedin
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-3 col-6 footer-links">
              <h4>Service by Baliyo Ventures</h4>
              <ul className="row row-cols-1">
                <li className="footerlinks">
                  <Link href="#">
                    <span>Product Development</span>
                  </Link>
                </li>
                <li className="footerlinks">
                  <Link href="#">
                    <span>Baliyo Architecture</span>
                  </Link>
                </li>
                <li className="footerlinks">
                  <Link href="#">
                    <span>Baliyo Software</span>
                  </Link>
                </li>
                <li className="footerlinks">
                  <Link href="#">
                    <span>Baliyo Marketing</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-12 footer-contact text-start text-md-start">
              <h4>Contact Baliyo Ventures</h4>
              <p className="mb-1">Baliyo Ventures Pvt. Ltd.</p>
              <p className="mb-1">Pulchowk, Lalitpur</p>
              <p className="mb-1">Office Hours ⋅ 9AM - 6 PM</p>
              <p className="mt-1 mb-1">
                <strong>Phone: </strong>
                <Link href="tel:9866316114">9866316114</Link>
              </p>
              <p>
                <strong>Email: </strong>
                <Link href="mailto:baliyoventures@gmail.com">
                  baliyoventures@gmail.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="container copyright text-start text-md-center mt-4">
          <p>
            ©2023 <span>Copyright</span>{" "}
            <strong className="px-1">Baliyo Ventures Inc.</strong>{" "}
            <span>All Rights Reserved</span>
          </p>
        </div>
      </footer>
      <div className="bg-white">
        <img src="/pattern.svg" alt="" className="img-fluid mb-0" />
      </div>
    </>
  );
};

export default Footer;
