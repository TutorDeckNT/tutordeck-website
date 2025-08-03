import { NavLink } from 'react-router-dom';

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-30 bg-dark-bg/70 backdrop-blur-lg border-b border-gray-700/50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <NavLink to="/" className="flex items-center space-x-3">
                <img src="/tutordeck-website/mascot.jpg" alt="TutorDeck Mascot" className="h-10 w-10 rounded-full object-cover" />
                <span className="text-2xl font-bold text-dark-heading">TutorDeck</span>
            </NavLink>
            <nav className="hidden md:flex items-center space-x-8">
                <NavLink to="/about" className={({isActive}) => `transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`}>About</NavLink>
                <NavLink to="/chapters" className={({isActive}) => `transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`}>Chapters</NavLink>
            </nav>
            <NavLink to="/get-involved" className="cta-button bg-gradient-to-r from-primary to-secondary-light text-dark-bg font-semibold px-5 py-2 rounded-lg hover:opacity-90">
                Get Involved
            </NavLink>
        </div>
    </header>
);

export default Header;
