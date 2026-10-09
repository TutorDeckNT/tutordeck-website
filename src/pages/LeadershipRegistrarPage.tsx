import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import LeaderCard from '../components/LeaderCard';
import { registrarLeaders } from '../data/leaders';

const LeadershipRegistrarPage = () => (
  <main className="container mx-auto px-6 py-20 mt-16 mb-16">
    <Reveal className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-dark-heading">Leadership Registrar</h1>
      <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">Meet the leaders serving TutorDeck chapters beyond Prosper High School.</p>
      <Link to="/" className="inline-block mt-6 text-primary font-semibold hover:underline">Back to Prosper leaders</Link>
    </Reveal>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {registrarLeaders.map(leader => (
        <LeaderCard key={leader.name} leader={leader} />
      ))}
    </div>
  </main>
);

export default LeadershipRegistrarPage;
