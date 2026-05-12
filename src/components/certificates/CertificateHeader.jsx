import { BARANGAY_INFO } from "../../data/mockData";

export default function CertificateHeader({
  title,
  subtitle,
  blueTitle = true,
}) {
  return (
    <div
      style={{
        borderBottom: "2px solid #333",
        padding: "10px 20px 14px",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* LEFT LOGO */}
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "12px",
          width: "85px",
          height: "85px",
          borderRadius: "50%",
          border: "2px solid #888",
          overflow: "hidden",
          background: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "bold",
        }}
      >
        BP
      </div>

      {/* RIGHT LOGO */}
      <div
        style={{
          position: "absolute",
          right: "20px",
          top: "12px",
          width: "85px",
          height: "85px",
          borderRadius: "50%",
          border: "2px solid #888",
          overflow: "hidden",
          background: "#fef9c3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "bold",
        }}
      >
        LOGO
      </div>

      <p
        style={{
          margin: 0,
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        REPUBLIKA NG PILIPINAS
      </p>

      <p style={{ margin: "2px 0", fontSize: "13px" }}>Lalawigan ng Laguna</p>

      <p style={{ margin: "2px 0", fontSize: "13px" }}>Lungsod ng Biñan</p>

      <h1
        style={{
          margin: "10px 0 8px",
          fontSize: "42px",
          fontWeight: "bold",
        }}
      >
        {BARANGAY_INFO.name || "Barangay Platero"}
      </h1>

      <div
        style={{
          width: "75%",
          margin: "0 auto",
          borderBottom: "5px solid #2563eb",
        }}
      />

      <div
        style={{
          textAlign: "center",
          marginTop: "14px",
        }}
      >
        <h2
          style={{
            color: blueTitle ? "#2563eb" : "#111",
            fontSize: "34px",
            fontWeight: "bold",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "14px",
              fontStyle: "italic",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
