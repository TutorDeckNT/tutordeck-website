import DesktopNavbar from './header/DesktopNavbar';
import MobileDock from './header/MobileDock';

const Header = () => {
    return (
        <>
            {/* 
              Global Ambient Glow 
              This creates a subtle light leak at the top of the page 
              to integrate the header with the background.
            */}
            <div className="fixed top-0 left-0 right-0 h-32 z-30 pointer-events-none bg-gradient-to-b from-dark-bg/80 to-transparent"></div>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <div className="hidden lg:block">
                <DesktopNavbar />
            </div>

            {/* Mobile Navigation (Hidden on Desktop) */}
            <div className="lg:hidden">
                <MobileDock />
            </div>
        </>
    );
};

export default Header;
