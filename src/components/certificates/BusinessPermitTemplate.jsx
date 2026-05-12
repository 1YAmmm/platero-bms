import CertificateLayout from "./CertificateLayout";
import { formatDate, BARANGAY_INFO } from "../../data/mockData";

export default function BusinessPermitTemplate({ cert, barangayInfo }) {
  return (
    <CertificateLayout title="Barangay Clearance">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <strong>BC NO :</strong> {cert.id}
        </div>

        <div>
          <strong>Business Permit Plate No :</strong> {cert.orNumber || "01"}
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

        <p style={{ textAlign: "center" }}>
          This is to certify that the business or trade activity described
          below.
        </p>

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              fontSize: "34px",
              fontWeight: "bold",
            }}
          >
            {cert.businessName?.toUpperCase()}
          </div>

          <div style={{ fontStyle: "italic" }}>
            (Business Name or Trade Activity)
          </div>

          <div
            style={{
              marginTop: "18px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {cert.businessAddress?.toUpperCase()}
          </div>

          <div style={{ fontStyle: "italic" }}>(Location)</div>

          <div
            style={{
              marginTop: "18px",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {cert.operatorName?.toUpperCase()}
          </div>

          <div style={{ fontStyle: "italic" }}>(Operator / Manager)</div>

          <div
            style={{
              marginTop: "18px",
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            {cert.businessNature?.toUpperCase()}
          </div>

          <div style={{ fontStyle: "italic" }}>(Nature of Business)</div>
        </div>

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
              Barangay Chairman
            </div>
          </div>
        </div>
      </div>
    </CertificateLayout>
  );
}
