// src/components/Footer.tsx

import { Link } from 'react-router-dom';

const Footer = () => (
    <footer id="contact" className="bg-dark-card border-t border-gray-700/50 relative">
        {/* Hypermodern Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-primary/50 [mask-image:radial-gradient(50%_100%_at_50%_0%,#000_0%,transparent_100%)]"></div>

        <div className="container mx-auto px-6 pt-16 pb-8">
            {/* Upper Tier: Main Content Grid */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
                {/* Column 1: Branding */}
                <div className="md:col-span-1">
                    <Link to="/" className="flex items-center space-x-3 mb-4">
                        <img src="/mascot.svg" alt="TutorDeck Mascot" className="h-10 w-10 rounded-no object-cover" />
                        <h3 className="text-2xl font-bold text-dark-heading">TutorDeck</h3>
                    </Link>
                    <p className="text-sm text-gray-400">Based in North Texas, Serving Globally.</p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="font-semibold text-dark-heading mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link to="/chapters" className="text-gray-400 hover:text-primary transition-colors">Our Chapters</Link></li>
                        <li><Link to="/get-involved" className="text-gray-400 hover:text-primary transition-colors">Get Involved</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h4 className="font-semibold text-dark-heading mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                            <i className="fas fa-envelope w-6 text-primary/70 pt-1"></i>
                            <a href="mailto:join@tutordeck.org" className="text-gray-400 hover:text-primary transition-colors">
                                join@tutordeck.org
                            </a>
                        </li>
                        <li className="flex items-start">
                            <i className="fas fa-phone w-6 text-primary/70 pt-1"></i>
                            <span className="text-gray-400">(469) 850-4335</span>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Social Media */}
                <div>
                    <h4 className="font-semibold text-dark-heading mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="text-2xl text-gray-400 hover:text-primary hover:scale-110 transition-all" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a 
                          href="https://www.instagram.com/tutordeck___/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-2xl text-gray-400 hover:text-primary hover:scale-110 transition-all"
                          aria-label="Instagram"
                        >
                          <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-2xl text-gray-400 hover:text-primary hover:scale-110 transition-all" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>

            {/* Lower Tier: Copyright and Legal Links */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 border-t border-gray-700/50 pt-6">
                <p>&copy; 2025 TutorDeck. All Rights Reserved.</p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
