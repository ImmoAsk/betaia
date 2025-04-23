"use client";

export default function LeasePreview({ data, previewRef }) {
  const depositAmount = (parseInt(data.monthlyRent) * 3).toLocaleString();

  return (
    <div ref={previewRef}>
      <h2 className="text-center mb-4">RESIDENTIAL LEASE AGREEMENT</h2>
      <p className="text-center">
        <strong>YEAR TWO THOUSAND AND TWENTY-FOUR, ON THE {Date()}</strong>
      </p>

      <p>
        <strong>BETWEEN THE UNDERSIGNED:</strong>
      </p>

      <p>
        <strong>{data.landlord_fullname}</strong>, residing in{" "}
        <strong>{data.landlord_address}</strong>, holder of ID card No.{" "}
        <strong>{data.landlord_id}</strong>, Tel:{" "}
        <strong>{data.landlord_phoneNumber}</strong>,{" "}
        <strong>{data.landlord_pobox}</strong>; of{" "}
        <strong>{data.landlord_nationality} nationality</strong>,<br />
        Hereinafter referred to as <strong>“THE LESSOR”</strong>, a term that
        shall also apply, where appropriate, to his legal representatives.
      </p>

      <p>
        <strong>OF THE FIRST PART, AND</strong>
      </p>

      <p>
        Mr/Mrs. <strong>{data.tenant_fullname} </strong>residing in Lomé,{" "}
        <strong>{data.tenant_address} </strong>
        neighborhood, holder of national ID card / voter card / passport No.{" "}
        <strong>{data.tenant_id}</strong>, issued on{" "}
        <strong>{data.tenant_idissueddate}</strong>, Tel:
        <strong> {data.tenant_phoneNumber}</strong>
        <br />
        Born in (City/Prefecture) <strong>
          {data.tenant_hometown}
        </strong> on <strong>{data.tenant_dateofbirth}</strong>, of{" "}
        <strong>{data.tenant_nationality} nationality.</strong>
        <br />
        In case of an accident or illness, contact:{" "}
        <strong>Mr./Mrs. {data.emergencycontact_name}</strong>, residing in
        Lomé, <strong>{data.emergencycontact_address}</strong> neighborhood,
        Tel: <strong>{data.emergencycontact_phonenumber}</strong>.<br />
        Hereinafter referred to as <strong>“THE TENANT”</strong>
      </p>

      <p>
        <strong>OF THE SECOND PART</strong>
      </p>

      <p>The following has been agreed upon:</p>

      <hr></hr>

      <h5>
        <strong>Article 1: PURPOSE</strong>
      </h5>
      <p>
        By this agreement, <strong>THE LESSOR</strong> leases, for residential
        use only, the premises located in{" "}
        <strong>{data.property_location}</strong> neighborhood, to the Tenant
        who accepts under the terms described herein. The Tenant declares that
        they have inspected the premises and found them suitable for the
        intended purpose.
      </p>

      <hr></hr>

      {/* <h5>Article 2: CONDITION OF THE PREMISES</h5>
      <p>
        The <strong>entry and exit condition reports</strong> shall be drawn up
        jointly by both parties. <br />
        The <strong>entry condition report</strong> is annexed to this
        agreement.
      </p>
      <hr></hr> */}

      {/* <h5>Article 3: OCCUPANCY TERMS</h5>
      <p>
        The Tenant shall{" "}
        <strong>
          occupy the premises exclusively for residential purposes. Subletting
          is strictly prohibited.
        </strong>
      </p>
      <hr></hr> */}
      <h5>Article 4: TERM – COMMENCEMENT</h5>
      <p>
        This lease is signed for a <strong>fixed term of one (1) year</strong>,
        renewable by written amendment or <strong>tacit renewal</strong>, unless
        expressly terminated by either party with{" "}
        <strong>two (2) months’ notice </strong> the end date. <br />
        The lease <strong>begins on {data.leaseStart} </strong> and{" "}
        <strong>ends on{data.leaseEnd}</strong>.
      </p>
      <hr></hr>
      <h5>Article 5: RENT</h5>
      <p>
        The lease is granted for a{" "}
        <strong>
          monthly rent of {parseInt(data.monthlyRent).toLocaleString()} CFA
          francs
        </strong>
        , which the Tenant agrees to pay{" "}
        <strong> quarterly, semi-annually, or annually,</strong>
        directly to the LESSOR or any individual formally appointed by the
        Lessor . Rent shall be paid by <strong>any legal means</strong> against
        a <strong>valid and final receipt.</strong>
      </p>
      <hr></hr>
      <h5>Article 6: SECURITY DEPOSIT AND GUARANTEE</h5>
      <p>
        The Tenant shall pay a{" "}
        <strong>security deposit equal to three (3) months’ rent</strong>, i.e.,
        the sum of <strong>{depositAmount} CFA francs</strong>, at the time of
        signing this agreement. <br /> The deposit will be returned to the
        Tenant <strong>one (1) month after vacating</strong>, provided all{" "}
        <strong>end-of-lease obligations</strong> are met, especially any
        necessary repairs as noted in comparison with the entry condition
        report.
      </p>
      <hr></hr>

      <p className="mt-5">
        Made and signed in Lomé, in two (2) original copies.
      </p>
    </div>
  );
}
