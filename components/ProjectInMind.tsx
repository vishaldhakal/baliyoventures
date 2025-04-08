import Link from "next/link";

const ProjectInMind = () => {
  return (
    <section className="relative py-20 md:py-28">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/project-in-mind-bg.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-25 z-10"></div>

      {/* Gradient Overlay - Updated to match Figma design */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#282303] to-transparent"></div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-xl md:max-w-2xl md:ml-8 lg:ml-16 py-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-oxanium mb-8 bg-gradient-to-br from-yellow-300 to-[#FFFCCB] bg-clip-text text-transparent">
            Got any Project in mind?
          </h2>
          <p className="text-white text-lg leading-relaxed mb-12">
            Take your project ideas to us, and we will help you plan, develop,
            and implement them into reality with precision and innovation!
          </p>
          <Link href="/contact" passHref>
            <button className="px-6 py-3 bg-black bg-opacity-20 text-white border-2 border-yellow-300 rounded-md font-oxanium text-lg transition-all duration-300 hover:bg-[rgba(240,209,0,0.7)] hover:shadow-md">
              Discuss your Project
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectInMind;
