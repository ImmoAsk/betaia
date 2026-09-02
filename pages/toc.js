import React from "react";
import { Container } from "react-bootstrap";
import RealEstatePageLayout from "../components/partials/RealEstatePageLayout";
import { useSession } from "next-auth/react";

export default function TermsOfUsePage() {
  const { data: session } = useSession();
  const catalog_title = "Conditions d'utilisation | ImmoAsk";

  return (
    <RealEstatePageLayout
      pageTitle={catalog_title}
      pageDescription={"Les conditions d'utilisation de la plateforme ImmoAsk au Togo."}
      activeNav="TOC"
      userLoggedIn={session ? true : false}
    >
      <Container className="mt-5 pt-5 p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Conditions d'utilisation</h1>

        <p className="mb-4">
          Les présentes conditions d’utilisation (ci-après les « Conditions ») régissent l’accès et l’usage de la plateforme <strong>ImmoAsk</strong>, opérée au Togo et destinée aux professionnels immobiliers, propriétaires bailleurs et utilisateurs en recherche de biens immobiliers ou fonciers. En accédant à la plateforme ou en utilisant les services, l’utilisateur reconnaît avoir lu, compris et accepté sans réserve les Conditions.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Objet des services</h2>
        <p className="mb-3">
          La plateforme ImmoAsk met à disposition :
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Pour les professionnels immobiliers :</strong> un service de marketing de biens immobiliers, ainsi que des services payants de prospection et des abonnements mensuels ou annuels.
          </li>
          <li>
            <strong>Pour les propriétaires :</strong> des services payants de prospection et des offres complètes de gestion immobilière pouvant inclure la gestion locative, le suivi administratif et la coordination opérationnelle.
          </li>
          <li>
            <strong>Pour les aspirants locataires de logements et acquereurs de terrains ou investisseurs immobiliers :</strong> un accès aux biens via un abonnement temporaire.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Conditions d’accès et d’inscription</h2>
        <p className="mb-4">
          L’accès à certaines fonctionnalités nécessite la création d’un compte utilisateur. L’utilisateur s’engage à fournir des informations exactes, sincères et régulièrement mises à jour. ImmoAsk se réserve le droit de refuser ou de suspendre un compte en cas de non‑respect des présentes Conditions.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Modalités financières</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>professionnels immobiliers :</strong> les annonces sont publiées gratuitement. Les services de prospection ainsi que les abonnements sont facturés selon les tarifs en vigueur au moment de la souscription.
          </li>
          <li>
            <strong>Propriétaires :</strong> les services de prospection et les contrats de gestion sont facturés conformément aux conditions contractuelles convenues avec ImmoAsk.
          </li>
          <li>
            <strong>Utilisateurs chercheurs :</strong> l’abonnement temporaire est payable à l’activation et n’est pas remboursable, sauf disposition contraire imposée par la loi.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Obligations et responsabilités des utilisateurs</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>L’utilisateur s’engage à utiliser la plateforme dans le respect des lois et réglementations en vigueur au Togo.</li>
          <li>
            L’agent immobilier garantit détenir l’autorisation nécessaire pour publier les annonces et mener les opérations immobilières proposées.
          </li>
          <li>
            Le propriétaire atteste de la conformité juridique des biens mis en location ou en gestion.
          </li>
          <li>
            Le chercheur de biens s’engage à ne pas faire une utilisation abusive des données et contacts obtenus via la plateforme.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Utilisation conforme de la plateforme</h2>
        <p className="mb-4">Il est strictement interdit d’utiliser la plateforme pour :</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Publier des informations frauduleuses, inexactes ou trompeuses.</li>
          <li>Usurper l’identité d’un tiers ou importer des contenus sans autorisation.</li>
          <li>Collecter des données ou tenter d’accéder illégalement aux systèmes d’ImmoAsk.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Données personnelles</h2>
        <p className="mb-4">
          ImmoAsk collecte et traite les données personnelles conformément à la législation en vigueur. Les données ne sont en aucun cas revendues à des tiers. L’utilisateur dispose d’un droit d’accès, de rectification et de suppression conformément aux lois applicables.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Propriété intellectuelle</h2>
        <p className="mb-4">
          La plateforme, ses contenus, logos, éléments graphiques et technologiques sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction ou diffusion non autorisée est strictement interdite.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Limitation de responsabilité</h2>
        <p className="mb-4">
          ImmoAsk intervient exclusivement en tant qu’intermédiaire. La plateforme ne garantit pas l’exactitude des informations fournies par les utilisateurs et ne peut être tenue responsable des transactions ou litiges entre utilisateurs. Chaque partie reste seule responsable de ses vérifications et obligations légales.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">9. Suspension et résiliation</h2>
        <p className="mb-4">
          ImmoAsk se réserve le droit de suspendre ou de résilier tout compte en cas de non‑respect des présentes Conditions, de fraude, d’usage abusif ou de tentative d’atteinte à l’intégrité de la plateforme.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">10. Modification des Conditions</h2>
        <p className="mb-8">
          Les Conditions peuvent être modifiées à tout moment. Toute modification substantielle sera communiquée aux utilisateurs par tout moyen jugé approprié. L’utilisation continue de la plateforme vaut acceptation des Conditions mises à jour.
        </p>

        <p className="text-sm text-gray-500 mt-10">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
      </Container>
    </RealEstatePageLayout>
  );
}
