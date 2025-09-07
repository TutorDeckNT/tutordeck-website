import { useState, useMemo } from 'react';
import Reveal from '../components/Reveal';

const chapterData = [
    { 
        name: 'Prosper High School', 
        location: 'Prosper, TX', 
        advisor: 'Mr. Graham and Mrs. Ballard', 
        lead: 'Manav A, Shaurya J, and Aakanksh R', 
        img: '/Prosper_High_School.avif' 
    },
    // --------------------------
    { 
        name: 'Richland High School', 
        location: 'Prosper, TX', 
        advisor: 'Mrs. Bedell', 
        lead: 'Alwin John SV', 
        img: '/richlandhs.avif' 
    },
];

const ChapterCard = ({ chapter }: { chapter: typeof chapterData[0] }) => (
    <div className="bg-dark-card rounded-lg border border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img src={chapter.img} className="w-full h-48 object-cover" alt={chapter.name} />
        <div className="p-6">
            <h3 className="text-2xl font-bold text-dark-heading">{chapter.name}</h3>
            <p className="text-primary font-semibold">{chapter.location}</p>
            <div className="mt-4 text-sm">
                <p><strong className="text-dark-text">Faculty Advisor:</strong> {chapter.advisor}</p>
                <p><strong className="text-dark-text">Student Lead:</strong> {chapter.lead}</p>
            </div>
        </div>
    </div>
);

const NewChapterCard = () => (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-lg border border-primary/50 flex flex-col items-center justify-center p-6 text-center text-dark-bg transform hover:-translate-y-2 transition-transform duration-300">
        <i className="fas fa-plus-circle text-5xl mb-4"></i>
        <h3 className="text-2xl font-extrabold">Your School Here</h3>
        <p className="font-semibold mb-4">Bring TutorDeck to your community.</p>
        <a href="#/get-involved" className="bg-dark-bg text-primary font-bold px-6 py-2 rounded-lg hover:opacity-90">Learn How</a>
    </div>
);

const ChaptersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredChapters = useMemo(() => 
        chapterData.filter(chapter => 
            chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chapter.location.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
    [searchTerm]);

    return (
        <main className="container mx-auto px-6 py-20 mt-16">
            <Reveal className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-dark-heading">Our Chapters</h1>
                <p className="text-lg mt-4 max-w-3xl mx-auto">Find a TutorDeck chapter near you, or learn how to start a new one.</p>
            </Reveal>

            <Reveal className="mb-12 max-w-2xl mx-auto">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fas fa-search text-gray-500"></i></span>
                    <input 
                        type="text"
                        placeholder="Search by school name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-card border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </Reveal>

            <Reveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredChapters.map(chapter => <ChapterCard key={chapter.name} chapter={chapter} />)}
                <NewChapterCard />
            </Reveal>
            
            {filteredChapters.length === 0 && searchTerm && (
                <Reveal className="text-center col-span-full mt-12 bg-dark-card p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-dark-heading">No Chapters Found</h3>
                    <p className="text-dark-text mt-2">We couldn't find a chapter matching your search. Why not be the first to start one at your school?</p>
                    <a href="#/get-involved" className="cta-button mt-6 inline-block bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">Start a Chapter</a>
                </Reveal>
            )}
        </main>
    );
};

export default ChaptersPage;
