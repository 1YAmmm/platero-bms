import CertificateHeader from "./CertificateHeader";
import CertificateFooter from "./CertificateFooter";

export default function CertificateLayout({ children, title, subtitle }) {
  return (
    <div className="certificate-paper">
      <div className="certificate-inner">
        <CertificateHeader title={title} subtitle={subtitle} />

        <div className="certificate-body">{children}</div>

        <CertificateFooter />
      </div>
    </div>
  );
}
