import StarField from "../threeJs/StarField";

export default function NotFound() {
  return (
    <>
      <StarField />

      <div className="text-center p-8  rounded-lg bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-lg opacity-80">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Page non trouvée
        </h2>
        <p className="text-white mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </>
  );
}
