import { Users } from 'lucide-react';
import Card from '../components/ui/Card';
// import Button from '../components/ui/Button'; // TODO: réactiver avec le bouton recrutement

const teamMembers = [
  {
    name: 'Sophie Durand',
    role: 'Directrice',
    bio: "Experte en tourisme avec plus de 15 ans d'expérience dans le secteur de l'hébergement.",
    image:
      'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Marc Lefebvre',
    role: 'Responsable Classement',
    bio: 'Auditeur certifié, spécialiste des normes et critères de classement des hébergements touristiques.',
    image:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Julie Martin',
    role: 'Chargée de clientèle',
    bio: 'Accompagne les propriétaires dans leurs démarches et répond à toutes leurs questions.',
    image:
      'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Thomas Bernard',
    role: 'Consultant',
    bio: 'Conseille les propriétaires sur les améliorations à apporter pour optimiser leur classement.',
    image:
      'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Caroline Petit',
    role: 'Responsable Administrative',
    bio: "Gère l'ensemble des dossiers et assure le suivi administratif des demandes de classement.",
    image:
      'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Alexandre Moreau',
    role: 'Chargé de Communication',
    bio: 'Informe et sensibilise les propriétaires sur les enjeux et bénéfices du classement.',
    image:
      'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function Equipe() {
  return (
    <>
      <section className="py-section bg-gradient-to-br from-themePrimary-1 to-primary-300 text-white">
        <div className="container-adaptive">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-white">Notre équipe</h1>
            <p className="text-xl text-white/90 leading-comfortable">
              Une équipe d'experts passionnés et engagés pour vous accompagner dans la valorisation
              de votre meublé de tourisme.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-6">Des professionnels à votre écoute</h2>
            <p className="text-lg text-textLight leading-comfortable">
              Chez Etoilys, nous mettons notre expertise au service de votre projet. Chaque membre
              de notre équipe est dédié à vous offrir un accompagnement personnalisé et de qualité,
              de la première prise de contact jusqu'à l'obtention de votre certificat de classement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-300 font-medium mb-3">{member.role}</p>
                  <p className="text-textLight leading-comfortable text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-primary-100 rounded-card p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <Users className="h-16 w-16 text-primary-300 mb-6" />
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">
                Rejoignez-nous
              </h3>
              <p className="text-textLight leading-comfortable mb-6">
                Vous partagez notre passion pour le tourisme et la qualité de service ? Nous
                recrutons régulièrement de nouveaux talents pour renforcer notre équipe.
              </p>
              {/* TODO: réactiver quand la page recrutement sera prête
              <Button href='/recrutement' variant='primary'>
                Voir nos offres d'emploi
              </Button>
              */}
            </div>
          </div>
        </div>
      </section>

      <section className="py-section bg-accent-1">
        <div className="container-adaptive">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-card">
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                  Expertise
                </h3>
                <p className="text-textLight leading-comfortable">
                  Une connaissance approfondie du secteur et des normes de classement.
                </p>
              </div>
              <div className="bg-white p-6 rounded-card">
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                  Accompagnement
                </h3>
                <p className="text-textLight leading-comfortable">
                  Un suivi personnalisé à chaque étape de votre démarche.
                </p>
              </div>
              <div className="bg-white p-6 rounded-card">
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                  Transparence
                </h3>
                <p className="text-textLight leading-comfortable">
                  Des informations claires et une communication honnête.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
