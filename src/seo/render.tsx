import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { StaticPageContext } from './StaticPageContext';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import LeadershipRegistrarPage from '../pages/LeadershipRegistrarPage';
import ChaptersPage from '../pages/ChaptersPage';
import PartnershipsPage from '../pages/PartnershipsPage';
import GetInvolvedPage from '../pages/GetInvolvedPage';

export const publicPages = [
  { path: '/', label: 'Home', title: 'TutorDeck - A Student-Led Tutoring Initiative', description: 'TutorDeck connects students through peer-led tutoring, school chapters, leadership, and volunteer service.', component: HomePage },
  { path: '/about/', label: 'About', title: 'About TutorDeck | Our Story and Mission', description: 'Discover TutorDeck’s story, founders, mission, vision, and commitment to accessible peer education.', component: AboutPage },
  { path: '/leadership-registrar/', label: 'Leadership', title: 'Leadership Registrar | TutorDeck', description: 'Meet the student leaders serving TutorDeck chapters across our school communities.', component: LeadershipRegistrarPage },
  { path: '/chapters/', label: 'Chapters', title: 'Our School Chapters | TutorDeck', description: 'Find TutorDeck school chapters, locations, and student leaders, or learn how to start a chapter.', component: ChaptersPage },
  { path: '/partnerships/', label: 'Partnerships', title: 'Nonprofit Partnerships | TutorDeck', description: 'Meet the organizations working with TutorDeck to make learning support more accessible.', component: PartnershipsPage },
  { path: '/get-involved/', label: 'Get Involved', title: 'Join or Start a Chapter | TutorDeck', description: 'Learn how to join a TutorDeck chapter, start one at your school, and complete our interest form.', component: GetInvolvedPage },
];

export function renderPage(path: string) {
  const page = publicPages.find(page => page.path === path);
  if (!page) throw new Error(`Unknown public page: ${path}`);
  const Page = page.component;
  const interactivePath = path === '/' ? '/#/' : `/#${path.slice(0, -1)}`;
  return renderToStaticMarkup(
    <StaticPageContext.Provider value={true}>
      <StaticRouter location={path}>
        <div className="static-public-page">
          <header className="container mx-auto px-6 py-6 border-b border-white/10">
            <a href="/" className="text-2xl font-extrabold text-primary">TutorDeck</a>
            <nav aria-label="Public pages" className="flex flex-wrap gap-4 mt-4">
              {publicPages.map(item => <a key={item.path} href={item.path} aria-current={item.path === path ? 'page' : undefined} className="text-dark-text hover:text-primary">{item.label}</a>)}
            </nav>
            <a href={interactivePath} className="inline-block mt-4 text-primary underline">Open interactive version</a>
          </header>
          <Page />
          <footer className="container mx-auto px-6 py-8 border-t border-white/10">
            <p>Student-led learning, leadership, and service.</p>
            <a href="mailto:join@tutordeck.org" className="inline-block mt-4 mr-6 text-primary underline">Contact TutorDeck</a>
            <a href={interactivePath} className="inline-block mt-4 text-primary underline">Open interactive version</a>
          </footer>
        </div>
      </StaticRouter>
    </StaticPageContext.Provider>,
  );
}
