import Reveal from '../components/Reveal';

const AboutPage = () => {
    return (
        <main className="container mx-auto px-6 py-20 mt-16">
            <Reveal className="text-center mb-20">
                <h1 className="text-5xl font-extrabold text-dark-heading">About TutorDeck</h1>
                <p className="text-lg mt-4 max-w-3xl mx-auto">We believe in the power of students to lift each other up. That's the core of our mission.</p>
            </Reveal>

            <Reveal as="section" className="mb-24">
                <h2 className="text-4xl font-bold text-dark-heading text-center mb-12">Our Story: From Idea to Initiative</h2>
                <div className="timeline">
                    <div className="timeline-container timeline-left"><div className="timeline-content"><h3 className="text-xl font-bold text-primary">Fall 2022 - The Idea</h3><p className="text-sm">Observing a need for accessible academic help, a group of students at Prosper High School drafts the initial concept for a peer-to-peer tutoring club.</p></div></div>
                    <div className="timeline-container timeline-right"><div className="timeline-content"><h3 className="text-xl font-bold text-primary">Spring 2023 - First Chapter</h3><p className="text-sm">The first official TutorDeck chapter launches at Prosper High, quickly gaining traction with both tutors and students seeking help.</p></div></div>
                    <div className="timeline-container timeline-left"><div className="timeline-content"><h3 className="text-xl font-bold text-primary">Fall 2023 - Expansion</h3><p className="text-sm">Seeing the success, Richland High School establishes the second TutorDeck chapter, proving the model is replicable and effective.</p></div></div>
                    <div className="timeline-container timeline-right"><div className="timeline-content"><h3 className="text-xl font-bold text-primary">Today - Growing the Movement</h3><p className="text-sm">We are actively working to become a registered nonprofit, expanding our digital resources and supporting new chapters nationwide.</p></div></div>
                </div>
            </Reveal>

            <Reveal as="section" className="grid md:grid-cols-2 gap-10 mb-24 items-stretch">
                <div className="bg-dark-card p-8 rounded-lg border border-primary/50"><h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2><p>To make quality educational support accessible to all students, fostering a culture of learning, leadership, and community service through a powerful peer-to-peer tutoring network.</p></div>
                <div className="bg-dark-card p-8 rounded-lg border border-secondary/50"><h2 className="text-3xl font-bold text-secondary mb-4">Our Vision</h2><p>To build a global, student-led movement where every student has the support they need to achieve their academic potential and the opportunity to develop as a leader.</p></div>
            </Reveal>

            <Reveal as="section" className="mb-24 text-center">
                <h2 className="text-4xl font-bold text-dark-heading mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-dark-card p-6 rounded-lg"><i className="fas fa-universal-access text-3xl text-primary mb-3"></i><h3 className="text-xl font-bold">Accessibility</h3><p className="text-sm">Breaking down barriers to learning for everyone.</p></div>
                    <div className="bg-dark-card p-6 rounded-lg"><i className="fas fa-users text-3xl text-primary mb-3"></i><h3 className="text-xl font-bold">Community</h3><p className="text-sm">Building supportive, collaborative school environments.</p></div>
                    <div className="bg-dark-card p-6 rounded-lg"><i className="fas fa-user-graduate text-3xl text-primary mb-3"></i><h3 className="text-xl font-bold">Leadership</h3><p className="text-sm">Empowering students to take initiative and guide others.</p></div>
                    <div className="bg-dark-card p-6 rounded-lg"><i className="fas fa-hands-helping text-3xl text-primary mb-3"></i><h3 className="text-xl font-bold">Service</h3><p className="text-sm">Fostering a lifelong commitment to helping others.</p></div>
                </div>
            </Reveal>
        </main>
    );
};

export default AboutPage;
