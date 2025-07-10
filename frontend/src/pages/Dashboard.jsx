import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import Globe from "../components/Globe";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-bg">
      <header className="dashboard-header">
        <img
          src="/VERT_worldscope.webp"
          alt="WorldScope logo"
          className="dashboard-logo"
        />
        <div className="dashboard-title-zone">
          <h1>
            Bienvenue sur <span>WorldScope</span>
          </h1>
          <p className="dashboard-slogan">
            Explorez l’actualité mondiale<br />via une vision planétaire interactive
          </p>
        </div>
      </header>
      <main className="dashboard-content">
        <section className="dashboard-globe">
  <div className="dashboard-globe-art" style={{ position: "relative" }}>
    <Globe />
    <button
      className="dashboard-globe-btn"
      style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      onClick={() => navigate("/map")}
    >
      🌍 Parcourir le Globe
    </button>
  </div>
</section>
        <section className="dashboard-info">
          <h2>Qu’allez-vous explorer aujourd’hui&nbsp;?</h2>
          <ul>
            <li>
              <b>Incidents géolocalisés</b> sur le globe <span role="img" aria-label="Globe">🌍</span>
            </li>
            <li>
              <b>Filtrage avancé</b> par type d’événement, date, pays…
            </li>
            <li>
              <b>Mode 3D immersif</b> pour mieux comprendre le monde
            </li>
            <li>
              <b>Design unique</b> inspiré des explorateurs modernes
            </li>
          </ul>
        </section>
      </main>
      <footer className="dashboard-footer">
        <small>WorldScope &copy; 2025 — Tous droits réservés.</small>
      </footer>
    </div>
  );
}
