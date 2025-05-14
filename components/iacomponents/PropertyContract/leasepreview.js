"use client";

import { format } from "date-fns"; // optional: for nicer date formatting

export default function LeasePreview({ data, previewRef }) {
  // Calcul du dépôt de garantie
  const depositAmount = (parseInt(data.monthlyRent) * 3).toLocaleString();

  // Date du contrat
  const today = format(new Date(), "dd/MM/yyyy");

  return (
    <div ref={previewRef}>
      {/* Titre principal */}
      <h2 className="text-center mb-4">Contrat de Bail {data.lease_type}</h2>

      {/* Date de signature */}
      <p className="text-center">
        <strong>Fait à Lomé, le {today}</strong>
      </p>

      {/* Informations sur le bailleur */}
      <section className="mb-4">
        <p><strong>ENTRE LES SOUSSIGNÉS :</strong></p>
        <p>
          <strong>{data.landlord_fullname}</strong>, demeurant à{" "}
          <strong>{data.landlord_address}</strong>, titulaire de la pièce
          d'identité n° <strong>{data.landlord_id}</strong>, Tél :{" "}
          <strong>{data.landlord_phoneNumber}</strong>,{" "}
          <strong>{data.landlord_pobox}</strong> ; de nationalité{" "}
          <strong>{data.landlord_nationality}</strong>.<br />
          Ci-après dénommé <strong>« LE BAILLEUR »</strong>.
        </p>
      </section>

      {/* Informations sur le locataire */}
      <section className="mb-4">
        <p><strong>D'UNE PART, ET :</strong></p>
        <p>
          M./Mme <strong>{data.tenant_fullname}</strong>, demeurant à Lomé, quartier{" "}
          <strong>{data.tenant_address}</strong>, titulaire de la pièce d'identité
          n° <strong>{data.tenant_id}</strong> délivrée le{" "}
          <strong>{data.tenant_idissueddate}</strong>. Tél :{" "}
          <strong>{data.tenant_phoneNumber}</strong>.<br />
          Né(e) à <strong>{data.tenant_hometown}</strong> le{" "}
          <strong>{data.tenant_dateofbirth}</strong>, de nationalité{" "}
          <strong>{data.tenant_nationality}</strong>.<br />
          {/* En cas d'urgence, contacter :{" "}
          <strong>{data.emergencycontact_name}</strong>, quartier{" "}
          <strong>{data.emergencycontact_address}</strong>, Tél :{" "}
          <strong>{data.emergencycontact_phonenumber}</strong>.<br /> */}
          Ci-après dénommé <strong>« LE LOCATAIRE »</strong>.
        </p>
      </section>

      <p><strong>D'AUTRE PART,</strong></p>
      <p>Il a été convenu ce qui suit :</p>

      <hr />

      {/* Article 1 : Objet */}
      <section className="mb-4">
        <h5><strong>Article 1 : OBJET</strong></h5>
        <p>
          Le BAILLEUR loue au LOCATAIRE, à usage exclusivement résidentiel, les locaux
          situés à <strong>{data.property_location}</strong>. Le locataire déclare
          avoir visité et accepté les lieux loués.
        </p>
      </section>

      <hr />

      {/* Article 4 : Durée */}
      <section className="mb-4">
        <h5><strong>Article 4 : DURÉE – PRISE D’EFFET</strong></h5>
        <p>
          Le bail est consenti pour une <strong>durée ferme d’un (1) an</strong>,
          renouvelable tacitement sauf préavis de <strong>deux (2) mois</strong> avant
          échéance.<br />
          Il <strong>prend effet le {data.leaseStart}</strong> et{" "}
          <strong>expire le {data.leaseEnd}</strong>.
        </p>
      </section>

      <hr />

      {/* Article 5 : Loyer */}
      <section className="mb-4">
        <h5><strong>Article 5 : LOYER</strong></h5>
        <p>
          Le loyer est fixé à <strong>{parseInt(data.monthlyRent).toLocaleString()} francs CFA</strong>
          par mois, payable <strong>trimestriellement, semestriellement ou annuellement</strong>,
          par tout moyen légal contre reçu valable.
        </p>
      </section>

      <hr />

      {/* Article 6 : Dépôt de garantie */}
      <section className="mb-4">
        <h5><strong>Article 6 : DÉPÔT DE GARANTIE</strong></h5>
        <p>
          Un dépôt de garantie de <strong>{depositAmount} francs CFA</strong> est exigé
          lors de la signature. Ce dépôt sera restitué <strong>un (1) mois</strong>
          après restitution des lieux, sous réserve des réparations éventuelles.
        </p>
      </section>

      <hr />

      {/* Clôture */}
      <p className="mt-5">
        Fait et signé à Lomé, en deux (2) exemplaires originaux.
      </p>
    </div>
  );
}