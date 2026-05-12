import CertificateLayout from "./CertificateLayout";
import { formatDate, BARANGAY_INFO } from "../../data/mockData";

export default function CertificationTemplate({ cert, barangayInfo }) {
  return (
    <CertificateLayout title={cert.type}>
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
          resident of Barangay Platero, City of Biñan, Laguna.
        </p>

        <p style={{ textIndent: "60px", textAlign: "justify" }}>
          This certification is issued for <strong>{cert.purpose}</strong> and
          for whatever legal purpose it may serve.
        </p>

        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
          }}
        >
          Issued this <strong>{formatDate(cert.issuedDate)}</strong>.
        </div>

        <div
          style={{
            marginTop: "120px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "260px",
              margin: "0 auto",
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
    </CertificateLayout>
  );
}
