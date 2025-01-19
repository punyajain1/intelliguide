
export const BodyC = ()=>{
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          {/* Heading */}
          <div className="flex items-center justify-center mb-4">
            <h1 className="head_text text-[#1A1A1A] font-bold transition-all duration-300 transform hover:scale-105">
              CodeForces IntelliGuide
            </h1>
          </div>
          {/* Tagline */}
          <p className="text-muted-foreground pt-3 max-w-2xl mx-auto text-[#f4f4f9] text-sm md:text-lg font-semibold">
            An{" "}<span className="text-red-400 underline hover:decoration-double">AI-Powered</span>{" "}profile analyzer that not only provides User Info but also gives{" "}<span className="text-red-400 underline hover:decoration-double">deep insights</span>{" "}and personalized recommendations.</p>
        </div>
      </div>
    );
  };
  