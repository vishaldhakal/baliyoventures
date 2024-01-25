import Link from "next/link";

export default function ProjectCard() {
  return (
    <>
      <div className="card border-0 shadow-lg rounded-mine my-3 my-md-0 condocard bigg">
        <div className="position-relative is-loading">
          <Link href="#" className="mylinkk" target="_blank">
            <img
              loading="lazy"
              src="/hiking.jpg"
              className="img-fluid condocard-img-top"
              alt="..."
            />
          </Link>
          <span className="mmmmm bg-yellow p-1 px-2">Software Development</span>
        </div>
        <Link
          href="#"
          className="card-body text-decoration-none text-dark bg-white shadow-lgg rounded-mine"
          target="_blank"
        >
          <div className="card-content pt-2">
            <h3 className="mb-1 cardd-title text-dark">HikingBees</h3>
            <h4 className="mb-2 cardd-subtitle">
              Travel and Tourism Marketplece
            </h4>
          </div>
        </Link>
      </div>
    </>
  );
}
