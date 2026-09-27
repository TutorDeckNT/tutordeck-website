import Reveal from '../components/Reveal';

const partners = [
    {
        name: 'Learn To Be',
        image: 'https://www.learntobe.org/assets/ltb_logo_with_icon-15741151bbc1867ee3750cc8849579612557be92ce60e5a859f8596d5f992f2a.png',
    },
    {
        name: 'Schoolhouse.world',
        image: 'https://mma.prnewswire.com/media/1681713/Schoolhouse_Logo.jpg?p=facebook',
    },
    {
        name: 'Diksuchi Foundation',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRftit06Ch_2vMMd-Mgvz3rx5HIuPAvOX2XuQOhHE5mu7pOcyToS7oO42Mu&s=10',
    },
    {
        name: 'Access Aid',
        image: 'https://aidaccess.org/lib/images/logo-flower.png',
    },
];

const PartnershipsPage = () => (
    <main className="container mx-auto px-6 py-20 mt-16">
        <Reveal className="text-center mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest">Working together</p>
            <h1 className="text-5xl font-extrabold text-dark-heading mt-3">Nonprofit Partnerships</h1>
            <p className="text-lg mt-4 max-w-3xl mx-auto">
                We work alongside mission-driven organizations to make learning support more accessible to students.
            </p>
        </Reveal>

        <Reveal as="section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {partners.map((partner) => (
                <article key={partner.name} className="bg-dark-card rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center gap-5 min-h-64">
                    <div className="h-32 w-full flex items-center justify-center">
                        <img
                            src={partner.image}
                            alt={`${partner.name} logo`}
                            loading="lazy"
                            className="max-h-28 max-w-full object-contain rounded-md"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-dark-heading text-center">{partner.name}</h2>
                </article>
            ))}
        </Reveal>
    </main>
);

export default PartnershipsPage;
