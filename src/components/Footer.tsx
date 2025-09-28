import { Link } from 'react-router-dom';

const Footer = () => (
    <footer id="contact" className="bg-dark-card border-t border-gray-700/50 pt-16 pb-8">
        {/* ... content of the footer remains the same ... */}
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-1">
                    <Link to="/" className="flex items-center space-x-3 mb-4">
                        <img src="/mascot.png" alt="TutorDeck Mascot" className="h-10 w-10 rounded-full object-cover" />
                        <h3 className="text-2xl font-bold text-dark-heading">TutorDeck</h3>
                    </Link>
                    <p className="text-sm">Based in North Texas, Serving Globally.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-dark-heading mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                        <li><Link to="/chapters" className="hover:text-primary">Our Chapters</Link></li>
                        <li><Link to="/get-involved" className="hover:text-primary">Get Involved</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-dark-heading mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                            <i className="fas fa-envelope w-6 text-primary pt-1"></i>
                            <a href="mailto:join@tutordeck.org" className="hover:text-primary">
                                join@tutordeck.org
                            </a>
                        </li>
                        <li className="flex items-start">
                            <i className="fas fa-phone w-6 text-primary pt-1"></i>
                            <span>(469) 850-4335</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-dark-heading mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="text-2xl hover:text-primary transition-colors" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a 
                          href="https://www.instagram.com/tutordeck___/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-2xl hover:text-primary transition-colors"
                          aria-label="Instagram"
                        >
                          <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-2xl hover:text-primary transition-colors" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-6">&copy; 2025 TutorDeck. All Rights Reserved.</div>
        </div>
    </footer>
);

// FIX: Use a default export
export default Footer;
