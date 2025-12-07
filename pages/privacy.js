import React from "react";
import { Container } from "react-bootstrap";
import RealEstatePageLayout from "../components/partials/RealEstatePageLayout";
import { useSession } from "next-auth/react";

export default function PrivacyPolicyPage() {
  const { data: session } = useSession();
  const catalog_title = "Politique de confidentialité | ImmoAsk";

  return (
    <RealEstatePageLayout
      pageTitle={catalog_title}
      pageDescription={"Politique de confidentialité de la plateforme ImmoAsk."}
      activeNav="TOC"
      userLoggedIn={session ? true : false}
    >
      <Container className="mt-5 pt-5 p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Politique de confidentialité</h1>

        <p className="mb-4">
          La présente politique de confidentialité (ci‑après la « Politique ») décrit les modalités selon lesquelles <strong>ImmoAsk</strong> collecte, utilise, conserve et protège les données à caractère personnel des utilisateurs de la plateforme, opérée depuis le Togo. En accédant ou en utilisant nos services, vous consentez aux pratiques décrites dans cette Politique.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Responsable du traitement</h2>
        <p className="mb-4">Le responsable du traitement des données est ImmoAsk. Pour toute question relative à la protection des données, vous pouvez nous contacter via les coordonnées figurant dans la section « Contact ».</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Données collectées</h2>
        <p className="mb-3">ImmoAsk peut collecter les catégories de données personnelles suivantes :</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Identifiants : nom, prénom, adresse e‑mail, numéro de téléphone, rôle (agent, propriétaire, chercheur).</li>
          <li>Informations professionnelles : nom d’agence, carte professionnelle, statut professionnel.</li>
          <li>Données relatives aux biens : adresse, photos, description, documents contractuels.</li>
          <li>Données de paiement : informations nécessaires au traitement des paiements (partagées via nos prestataires de paiement).</li>
          <li>Données de connexion : adresse IP, journaux d’activité, données de navigation et cookies.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Finalités du traitement</h2>
        <p className="mb-3">Les données sont traitées pour les finalités suivantes :</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Fournir et améliorer les services de publication, de gestion et de prospection immobilière.</li>
          <li>Gérer les comptes utilisateur et sécuriser l’accès à la plateforme.</li>
          <li>Traiter les paiements et la facturation.</li>
          <li>Communiquer avec les utilisateurs (notifications, messages, support).</li>
          <li>Conduire des analyses et statistiques pour optimiser l’expérience utilisateur.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Base juridique</h2>
        <p className="mb-4">Le traitement des données repose sur les bases juridiques suivantes : l’exécution du contrat, le consentement de l’utilisateur, le respect d’obligations légales et l’intérêt légitime d’ImmoAsk pour la sécurité et l’amélioration du service.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Destinataires des données</h2>
        <p className="mb-4">Les données peuvent être communiquées aux destinataires suivants :</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Prestataires techniques (hébergement, paiements, messagerie) contractuellement liés par des clauses de confidentialité.</li>
          <li>Autorités publiques lorsque la communication est requise par la loi.</li>
          <li>Autres utilisateurs de la plateforme dans le cadre de la publication d’annonces (par exemple, les informations de contact nécessaires à la prise de contact).</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Transferts de données</h2>
        <p className="mb-4">Si des transferts de données en dehors du Togo sont nécessaires, ImmoAsk prendra les mesures appropriées pour assurer un niveau de protection adéquat, notamment par la conclusion de garanties contractuelles ou en se conformant aux cadres légaux applicables.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Durée de conservation</h2>
        <p className="mb-4">Les données sont conservées pour la durée nécessaire aux finalités pour lesquelles elles ont été collectées, sauf obligation légale contraire. Les données liées aux comptes inactifs peuvent être archivées ou supprimées conformément à notre politique interne.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Sécurité</h2>
        <p className="mb-4">ImmoAsk met en œuvre des mesures techniques et organisationnelles adaptées afin de protéger les données personnelles contre la perte, l’altération, l’accès non autorisé ou la divulgation. Toutefois, aucune transmission de données sur internet n’est totalement sécurisée ; l’utilisateur est invité à signaler toute faille ou suspicion de violation.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">9. Droits des personnes</h2>
        <p className="mb-3">Conformément à la législation applicable, l’utilisateur dispose des droits suivants concernant ses données personnelles :</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Droit d’accès : obtenir confirmation et copie des données traitées.</li>
          <li>Droit de rectification : demander la correction de données inexactes ou incomplètes.</li>
          <li>Droit à l’effacement : demander la suppression des données, sous réserve des obligations légales et des besoins contractuels.</li>
          <li>Droit à la limitation du traitement et droit d’opposition.</li>
          <li>Droit à la portabilité des données lorsque cela est applicable.</li>
        </ul>
        <p className="mb-4">Pour exercer ces droits, contactez-nous via la section « Contact » en indiquant vos nom, adresse e‑mail et la demande précise. Nous répondrons dans les délais légaux applicables.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">10. Cookies et technologies similaires</h2>
        <p className="mb-4">La plateforme utilise des cookies et technologies similaires pour assurer son fonctionnement et analyser l’usage. L’utilisateur peut gérer ses préférences relatives aux cookies via les paramètres de son navigateur ou les outils fournis sur le site.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">11. Sécurité des mineurs</h2>
        <p className="mb-4">La plateforme n’est pas destinée aux mineurs de moins de 18 ans. Nous demandons aux parents et représentants légaux de ne pas permettre à des mineurs de fournir leurs données personnelles sans autorisation.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">12. Modifications de la Politique</h2>
        <p className="mb-4">ImmoAsk se réserve le droit de modifier la présente Politique. En cas de modification substantielle, nous en informerons les utilisateurs par tout moyen approprié. L’utilisation continue de la plateforme après modification vaut acceptation de la nouvelle Politique.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">13. Contact</h2>
        <p className="mb-4">Pour toute question relative à la protection des données, l’utilisateur peut contacter ImmoAsk à l’adresse e‑mail suivante : <em>contact@immoask.com</em></p>

        <p className="text-sm text-gray-500 mt-10">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
      </Container>
    </RealEstatePageLayout>
  );
}
