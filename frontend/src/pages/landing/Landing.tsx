import Contact from "./contact/Contact";
import Faq from "./faq/Faq";
import Features from "./features/Features";
import { AppLamp } from "./lamp/AppLamp";
import { AppNavbar } from "./navbar/AppNavBar";
import Pricing from "./pricing/Pricing";
import { ScrollTablet } from "./scroll-tablet/ScrollTablet";
import Testimonials from "./testimonials/Testimonials";

const Landing = () => {
  return (
    <div className="p-0 m-0">
      <AppNavbar />
      <main className="p-0 m-0">
        <AppLamp />
        <ScrollTablet/>
        <Features/>
        <Pricing/>
        <Testimonials/>
        <Faq/>
        <Contact/>
      </main>
    </div>
  );
};

export default Landing;
