import { Route, Switch } from "wouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import GettingStarted from "./pages/GettingStarted";
import Organization from "./pages/Organization";

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-4">
      <div>
        <p className="text-[#C9A84C] font-mono text-6xl font-bold mb-4">404</p>
        <h1 className="font-['Playfair_Display'] text-3xl text-white mb-4">Page Not Found</h1>
        <p className="text-[#555] mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-gold px-6 py-3 rounded-xl font-semibold">Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/careers" component={Careers} />
        <Route path="/contact" component={Contact} />
        <Route path="/getting-started" component={GettingStarted} />
        <Route path="/organization" component={Organization} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}
