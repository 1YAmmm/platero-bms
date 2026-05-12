import CertificateLayout from "./CertificateLayout";
import { formatDate, BARANGAY_INFO } from "../../data/mockData";

export default function BarangayClearanceTemplate({ cert, barangayInfo }) {
  return (
    <CertificateLayout title="Barangay Clearance">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginBottom: "30px",
        }}
      >
        <div>
          <strong>BC NO :</strong> {cert.id}
        </div>

        <div>
          <strong>Date :</strong> {formatDate(cert.issuedDate)}
        </div>
      </div>

      <div
        style={{
          fontSize: "18px",
          lineHeight: "2",
        }}
      >
        <p>
          <strong>To Whom It May Concern:</strong>
        </p>

        <p style={{ textIndent: "60px", textAlign: "justify" }}>
          This is to certify that{" "}
          <strong>{cert.residentName?.toUpperCase()}</strong> is a bonafide
          resident of Barangay Platero, City of Biñan, Laguna and is known to be
          of good moral character and law-abiding citizen in the community.
        </p>

        <p style={{ textIndent: "60px", textAlign: "justify" }}>
          This certification is being issued upon the request of the above-named
          person for <strong>{cert.purpose}</strong> and for whatever legal
          purpose it may serve.
        </p>

        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
          }}
        >
          Given this <strong>{formatDate(cert.issuedDate)}</strong> at Barangay
          Platero, Biñan City, Laguna.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "120px",
            padding: "0 40px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "240px",
                borderTop: "1px solid #000",
                paddingTop: "8px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {barangayInfo.secretary}
            </div>

            <div
              style={{
                fontStyle: "italic",
                fontSize: "16px",
              }}
            >
              Barangay Secretary
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "240px",
                borderTop: "1px solid #000",
                paddingTop: "8px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {barangayInfo.captain}
            </div>

            <div
              style={{
                fontStyle: "italic",
                fontSize: "16px",
              }}
            >
              Punong Barangay
            </div>
          </div>
        </div>
      </div>
    </CertificateLayout>
  );
}
