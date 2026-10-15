import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import LeaderCard from '../components/LeaderCard';
import { registrarLeaders } from '../data/leaders';
import { useStaticPage } from '../seo/StaticPageContext';

const LeadershipRegistrarPage = () => {
  const [query, setQuery] = useState('');
  const staticPage = useStaticPage();
  const search = query.trim().toLowerCase();
  const leaders = registrarLeaders.filter(leader => [leader.name, leader.role, leader.chapter].some(value => value?.toLowerCase().includes(search)));
  return (
    <main className="registrar-directory mx-auto px-6 pt-32 pb-24">
      <Reveal className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-dark-heading">Leadership Registrar</h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl">Meet the leaders serving TutorDeck chapters across our school communities.</p>
        <Link to="/" className="inline-block mt-5 text-primary font-semibold hover:underline">← Back to Our Leaders</Link>
      </Reveal>
      <div className="mb-8" data-leader-search>
        <label htmlFor="leader-search" className="block text-sm font-medium text-gray-300 mb-3">Find a leader</label>
        <input id="leader-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, role, or school" className="w-full rounded-lg bg-dark-card border border-gray-600 px-4 py-3 text-dark-heading focus-visible:outline-primary" />
        <p data-leader-count role="status" className="mt-3 text-sm text-gray-400">{leaders.length} {leaders.length === 1 ? 'leader' : 'leaders'}{search ? ' found' : ''}</p>
      </div>
      <h2 className="sr-only">Chapter leadership</h2>
      <ul className="registrar-list">
        {leaders.map(leader => <li key={leader.name} data-leader-entry data-search={[leader.name, leader.role, leader.chapter].filter(Boolean).join(' ')}><LeaderCard leader={leader} compact /></li>)}
      </ul>
      {(staticPage || leaders.length === 0) && <div data-leader-empty hidden={staticPage} className="py-12 text-center">
        <h2 className="text-xl font-semibold text-dark-heading">No leaders found</h2>
        <p className="mt-2 text-gray-400">Try another name, role, or school.</p>
        <button data-leader-clear type="button" onClick={() => setQuery('')} className="mt-5 text-primary underline px-4 py-3">Clear search</button>
      </div>}
    </main>
  );
};

export default LeadershipRegistrarPage;
