import { createContext, useContext } from 'react';

// Only enabled by the build-time public renderer; the hash app uses the default.
export const StaticPageContext = createContext(false);
export const useStaticPage = () => useContext(StaticPageContext);
