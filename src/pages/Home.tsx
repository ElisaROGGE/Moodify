import StatsSection from "../components/StatsSection";
import AnimatedTitle from "../components/AnimatedTitle";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <AnimatedTitle
              text="Moodify"
              className="text-6xl font-bold text-white mb-4 tracking-tight"
            />
            <p className="text-xl text-white/80 mb-2">
              Découvrez votre musique selon votre humeur
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-yellow-400 mx-auto rounded-full"></div>
          </div>

          {/* Options Cards */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Que voulez-vous faire aujourd'hui ?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Mood Card */}
              <OptionCard
                href="/mood"
                title="Découvrir par Mood"
                description="Trouvez la playlist parfaite selon votre humeur du moment"
                icon="🎭"
                gradient="from-pink-500 to-rose-500"
                hoverGradient="from-pink-600 to-rose-600"
                features={[
                  "Analyse d'humeur",
                  "Playlists personnalisées",
                  "Découvertes musicales",
                ]}
              />

              {/* Tournament Card */}
              <OptionCard
                href="/tournament"
                title="Tournoi d'Artistes"
                description="Créez un tournoi avec vos artistes préférés et découvrez votre champion"
                icon="🏆"
                gradient="from-amber-500 to-orange-500"
                hoverGradient="from-amber-600 to-orange-600"
                features={[
                  "16 artistes",
                  "Duels interactifs",
                  "Champion final",
                ]}
              />
            </div>

            <StatsSection />
          </div>

          <div className="mt-20 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <FeatureItem
                icon="🎵"
                title="Personnalisé"
                description="Basé sur vos goûts Spotify"
              />
              <FeatureItem
                icon="⚡"
                title="Rapide"
                description="Résultats instantanés"
              />
              <FeatureItem
                icon="🔥"
                title="Amusant"
                description="Expérience interactive"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OptionCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  hoverGradient: string;
  features: string[];
}

function OptionCard({
  href,
  title,
  description,
  icon,
  gradient,
  hoverGradient,
  features,
}: OptionCardProps) {
  return (
    <a
      href={href}
      className="group block transform hover:scale-105 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 h-full hover:bg-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25">
        {/* Background gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        ></div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all duration-500">
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/80 mb-6 leading-relaxed group-hover:text-white transition-colors duration-300">
            {description}
          </p>

          {/* Features */}
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full mr-3 group-hover:shadow-lg group-hover:shadow-pink-400/50 transition-all duration-300"></span>
                {feature}
              </li>
            ))}
          </ul>

          {/* Call to action */}
          <div
            className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${gradient} group-hover:bg-gradient-to-r group-hover:${hoverGradient} text-white font-semibold rounded-lg transform group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/30`}
          >
            Commencer
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="text-center group">
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
}
