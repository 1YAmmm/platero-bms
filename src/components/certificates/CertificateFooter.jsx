import { BARANGAY_INFO } from "../../data/mockData";

export default function CertificateFooter() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        left: 0,
        right: 0,
        background: "#bfdbfe",
        borderTop: "3px solid #ef4444",
        padding: "18px",
        textAlign: "center",
        fontSize: "13px",
        lineHeight: "1.8",
      }}
    >
      <div>
        <strong>
          Councillors: Hon. Lota F. Toledo, Hon. Enriqueta C. Lacaon, Hon. Elbeo
          J. Aurelio
        </strong>
      </div>

      <div>
        <strong>
          Secretary: {BARANGAY_INFO.secretary}
          &nbsp;&nbsp;&nbsp; Treasurer: Macrina B. Quico
        </strong>
      </div>
    </div>
  );
}
