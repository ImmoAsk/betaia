import React from "react";
import { Container } from "react-bootstrap";
import RealEstatePageLayout from "../components/partials/RealEstatePageLayout";
import { useSession } from "next-auth/react";

export default function LegalMentionPage() {
  const { data: session } = useSession();
  const pageTitle = "Mentions légales | ImmoAsk";

  return (
    <RealEstatePageLayout
      pageTitle={pageTitle}
      pageDescription="Informations légales de la plateforme ImmoAsk"
      activeNav="LEGAL"
      userLoggedIn={session ? true : false}
    >
      <Container className="mt-5 pt-5 p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>

        <p className="mb-4">
          La plateforme <strong>ImmoAsk</strong> est éditée et exploitée par <strong>Omnisoft Africa</strong>, société basée au Togo. L'ensemble des contenus, services et opérations proposés via la plateforme sont soumis aux lois et réglementations en vigueur en République Togolaise.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Éditeur de la plateforme</h2>
        <p className="mb-4">
          <strong>Omnisoft Africa</strong><br />
          Société de services numériques<br />
          Siège social : Lomé, Togo<br />
          Contact : <a href="mailto:contact@immoask.com">contact@immoask.com</a>
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hébergement</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Les données et l’API ImmoAsk sont hébergées sur des infrastructures situées en France, au sein des data centers de <strong>LWS (Ligne Web Services)</strong>.
          </li>
          <li>
            L’application web ImmoAsk est hébergée sur la plateforme <strong>Vercel</strong>.
          </li>
          <li>
            L’application mobile est distribuée via le <strong>Google Play Store</strong>.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Propriété intellectuelle</h2>
        <p className="mb-4">
          L’ensemble des éléments composant la plateforme ImmoAsk (textes, images, logos, interface, structure, code, contenus, etc.) est protégé par les lois togolaises et internationales relatives à la propriété intellectuelle. Toute reproduction, distribution, modification ou exploitation non autorisée est strictement interdite.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Responsabilité</h2>
        <p className="mb-4">
          ImmoAsk met tout en œuvre pour assurer l’exactitude et la mise à jour des informations diffusées, sans toutefois pouvoir en garantir l’exhaustivité ou l’absence d’erreurs. Omnisoft Africa ne saurait être tenue responsable :
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>des interruptions de service ou bugs techniques ;</li>
          <li>de l’inexactitude des contenus publiés par les utilisateurs ;</li>
          <li>de tout dommage direct ou indirect résultant de l’utilisation de la plateforme.</li>
        </ul>

        
              <h2 className="text-2xl font-semibold mt-6 mb-2">5. Cookies et traceurs</h2>
        <p className="mb-4">
          La plateforme ImmoAsk peut utiliser des cookies et technologies similaires afin d’assurer son bon fonctionnement, de mesurer l’audience, d’améliorer l’expérience utilisateur et de sécuriser les accès. L’utilisateur peut configurer son navigateur pour accepter, refuser ou limiter l’utilisation des cookies. Certaines fonctionnalités peuvent toutefois être dégradées en cas de désactivation totale.
        </p>

              <h2 className="text-2xl font-semibold mt-6 mb-2">6. Données personnelles</h2>
        <p className="mb-4">
          ImmoAsk collecte et traite des données personnelles conformément aux lois en vigueur au Togo et aux standards internationaux en matière de protection des données. Les informations recueillies dans le cadre de l’utilisation de la plateforme sont utilisées uniquement pour fournir les services proposés, assurer la sécurité des comptes, améliorer les fonctionnalités et respecter les obligations légales. L’utilisateur dispose d’un droit d’accès, de rectification et de suppression, qu’il peut exercer en contactant : <a href="mailto:contact@immoask.com">contact@immoask.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Litiges et juridiction compétente</h2>
        <p className="mb-4">
          Les présentes mentions légales sont régies par le droit togolais. En cas de litige relatif à l’interprétation, l’exécution ou la validité des présentes, les parties s’efforceront de trouver une résolution amiable. À défaut d’accord amiable, le différend sera porté devant les juridictions compétentes de la République Togolaise.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Contact</h2>
        <p className="mb-4">
          Pour toute question relative aux présentes mentions légales ou à la plateforme, vous pouvez nous contacter à l’adresse suivante :
          <br />
          <a href="mailto:contact@immoask.com">contact@immoask.com</a>
        </p>

        <p className="text-sm text-gray-500 mt-10">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

      </Container>
    </RealEstatePageLayout>
  );
}