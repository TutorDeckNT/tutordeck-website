import Icon from '../components/Icon';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStaticPage } from '../seo/StaticPageContext';
import Reveal from '../components/Reveal';

type Chapter = {
    name: string;
    location: string;
    lead?: string;
    peakMembers?: string;
    img: string;
    logo?: boolean;
    photoCredit?: boolean;
};

const chapterData: Chapter[] = [
    { 
        name: 'Prosper High School',
        peakMembers: '312',
        location: 'Prosper, TX', 
        lead: 'Manav A, Shaurya J, Aakanksh R, and Arnav Shah',
        img: '/Prosper_High_School.avif' 
    },
    // --------------------------
    { 
        name: 'Richland High School',
        peakMembers: '218',
        location: 'Prosper, TX', 
        lead: 'Alwin John SV', 
        img: '/richlandhs.avif' 
    },
    // --------------------------
    { 
        name: 'Ranchview High School',
        peakMembers: '127',
        location: 'Irving, TX', 
        lead: 'Arnav Chugh', 
        img: 'https://imagescdn.homes.com/i2/EnJzfV7ZPfxmCX6g8_jX6CtM8KfZ8yB0I_yrLw6EGIQ/113/ranchview-high-school-irving-tx-primaryphoto.jpg?p=1'
    },
    // --------------------------
    { 
        name: 'Mansfield High School',
        peakMembers: '97',
        location: 'Mansfield, TX', 
        lead: 'Jeet Bhandhari', 
        img: 'https://www.mansfieldtexas.gov/ImageRepository/Document?documentId=4695'
    },
    {
        name: 'Bridgeland High School',
        peakMembers: '132',
        location: 'Cypress, TX',
        lead: 'Austin Hodge (Student Lead), Rishit Shinkar (Treasurer)',
        img: 'https://www.bridgeland.com/wp-content/uploads/2025/04/schools-grid-bridgeland-high.webp'
    },
    {
        name: "Cypress High School",
        peakMembers: '71',
        location: "Cypress, CA",
        lead: "Rohan Mehta",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Cypress_High_School_Billboard.jpeg",
        photoCredit: true,
    },
    {
        name: "Cypress Lakes High School",
        peakMembers: '151',
        location: "Katy, TX",
        lead: "Nathaniel Brooks",
        img: "https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_3/v1716420247/cfisdnet/fs6lvktoniignukaskao/CyLakesHS.jpg",
    },
    {
        name: "Langham Creek High School",
        peakMembers: '~91',
        location: "Houston, TX",
        lead: "Adrian Park",
        img: "https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_3/v1709923916/cfisdnet/pgubxrcgses31tfujuzq/Langham_Creek_HS_02_Logo.png",
        logo: true,
    },
];

const launchingChapterData: Chapter[] = [
    {
        name: 'V.R. Eaton High School',
        location: 'Fort Worth, TX',
        img: 'https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_3/v1639761643/nisdtxorg/aqy12panyz6ochexozzu/EatonDedicationProgram.jpg'
    },
    {
        name: "Jersey Village High School",
        location: "Houston, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170611/cfisdnet/gjfybc8uyasu2isxweqa/JerseyVillageHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cy-Fair High School",
        location: "Cypress, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170509/cfisdnet/d8onv3p4c1bg2c5my0jq/Cy-FairHighSchoolPrimaryThumbnailImage.png",
        logo: true,
    },
    {
        name: "Cypress Creek High School",
        location: "Houston, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170513/cfisdnet/pljg1lp6czmvtzs7ddbj/CypressCreekHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cypress Falls High School",
        location: "Houston, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170516/cfisdnet/t0qqntbng6mvufkkfod7/CypressFallsHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cypress Park High School",
        location: "Cypress, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170523/cfisdnet/pujnibszw15c0h4vdgrw/CypressParkHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cypress Ranch High School",
        location: "Cypress, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170527/cfisdnet/iwtyl66w2vnnoljutg2n/CypressRanchHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cypress Ridge High School",
        location: "Houston, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170529/cfisdnet/mbyz1kgylxknhf6y0hix/CypressRidgeHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cypress Springs High School",
        location: "Cypress, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1713170532/cfisdnet/dzdfuva7h7ven4vpaxhn/CypressSpringsHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Cypress Woods High School",
        location: "Cypress, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_3/v1759150858/cfisdnet/rcfojg1iqtbc5jaft5h5/CypressWoodsHighSchoolPrimaryLogoImage.png",
        logo: true,
    },
    {
        name: "Seven Lakes High School",
        location: "Katy, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1744117965/katyisdorg/kaaoxjvxr2atj8bccehg/slhs.png",
        logo: true,
    },
    {
        name: "Tomball High School",
        location: "Tomball, TX",
        img: "https://resources.finalsite.net/images/f_auto,q_auto/v1667387635/tomballisdnet/v1ofjnshawdatnwordzp/TomballHigh.png",
        logo: true,
    },
];

const ChapterCard = ({ chapter, launching = false }: { chapter: Chapter; launching?: boolean }) => (
    <article className={`chapter-card ${launching ? 'chapter-card--launching' : ''}`}>
        <img src={chapter.img} loading="lazy" width={800} height={384} className={`chapter-image ${chapter.logo ? 'object-contain p-6 bg-white' : 'object-cover'}`} alt={chapter.logo ? `${chapter.name} logo` : chapter.name} />
        <div className="chapter-details">
            <h3 className="chapter-name text-dark-heading">{chapter.name}</h3>
            <p className="mt-2 text-sm text-gray-400">{chapter.location}</p>
            {chapter.lead && <div className="mt-4 text-sm">
                <p><strong className="text-dark-text">Student Lead:</strong> {chapter.lead}</p>
            </div>}
            <p className="chapter-members"><strong className="text-dark-text">{launching ? 'Members:' : 'Peak Member Count:'}</strong> <span>{launching ? 'Less than 50' : chapter.peakMembers}</span></p>
            {launching && <p className="mt-2 text-sm text-dark-text">Leaders and a small group of initial members are joining this chapter.</p>}
            {chapter.photoCredit && <p className="mt-4 text-xs">
                Photo: <a className="underline" href="https://commons.wikimedia.org/wiki/File:Cypress_High_School_Billboard.jpeg">Nathan Jones</a> / <a className="underline" href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>
            </p>}
        </div>
    </article>
);

const NewChapterCard = () => (
    <article className="chapter-invitation">
        <p className="text-primary text-sm font-semibold">A chapter starts with you</p>
        <h3>Bring TutorDeck<br />to your school.</h3>
        <p className="max-w-sm text-dark-text">Build a local community of students who help each other learn.</p>
        <Link to="/get-involved" className="chapter-link">Start a chapter <span aria-hidden="true">↗</span></Link>
    </article>
);

const ChaptersPage = () => {
    const staticPage = useStaticPage();
    const [searchTerm, setSearchTerm] = useState('');
    const { filteredChapters, filteredLaunchingChapters } = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = (chapter: Chapter) =>
            chapter.name.toLowerCase().includes(query) ||
            chapter.location.toLowerCase().includes(query);
        return {
            filteredChapters: chapterData.filter(matchesSearch),
            filteredLaunchingChapters: launchingChapterData.filter(matchesSearch),
        };
    }, [searchTerm]);

    return (
        <main className="chapter-directory mx-auto px-6 pt-32 pb-24">
            <Reveal className="chapter-intro mb-12">
                <h1>Our Chapters</h1>
                <p className="text-lg mt-6 max-w-xl leading-relaxed">Find a TutorDeck chapter near you, or learn how to start a new one.</p>
            </Reveal>

            {staticPage ? <p className="chapter-intro mb-12"><a href="/#/chapters" className="text-primary underline">Search chapters in the interactive version</a></p> : <Reveal className="mb-14 max-w-xl">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon className="fas fa-search text-gray-400" /></span>
                    <input 
                        aria-label="Search chapters by school or location"
                        type="text"
                        placeholder="Search by school name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-card border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </Reveal>}

            <section aria-labelledby="main-chapters-heading">
                <Reveal className="mb-8">
                    <h2 id="main-chapters-heading" className="text-3xl font-bold text-dark-heading">Main chapters</h2>
                </Reveal>
                <Reveal className="grid md:grid-cols-2 gap-x-10 gap-y-12">
                    {filteredChapters.map(chapter => <ChapterCard key={chapter.name} chapter={chapter} />)}
                    <NewChapterCard />
                </Reveal>
            </section>

            {filteredLaunchingChapters.length > 0 && <section className="mt-16" aria-labelledby="launching-chapters-heading">
                <Reveal className="mb-8">
                    <h2 id="launching-chapters-heading" className="text-3xl font-bold text-dark-heading">Currently launching</h2>
                    <p className="mt-3 text-dark-text">TutorDeck chapters are getting started at these high schools, with leaders and a small group of initial members joining each chapter.</p>
                </Reveal>
                <Reveal className="grid md:grid-cols-2 gap-x-10">
                    {filteredLaunchingChapters.map(chapter => <ChapterCard key={chapter.name} chapter={chapter} launching />)}
                </Reveal>
            </section>}
            
            {filteredChapters.length === 0 && filteredLaunchingChapters.length === 0 && searchTerm.trim() && (
                <Reveal className="text-center col-span-full mt-12 bg-dark-card p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-dark-heading">No chapters found</h2>
                    <p className="text-dark-text mt-2">We couldn't find a chapter matching your search. Why not be the first to start one at your school?</p>
                    <Link to="/get-involved" className="cta-button mt-6 inline-block bg-primary text-dark-bg font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors">Start a Chapter</Link>
                </Reveal>
            )}
        </main>
    );
};

export default ChaptersPage;
