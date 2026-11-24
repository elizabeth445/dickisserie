import { content } from "../data/content";
import { Icon } from "../components/Icon";
export function VisitSection() {
  return (
    <>
      <section
        id="visit"
        className="visit-section"
        aria-labelledby="visit-heading"
      >
        <div className="shell visit-layout">
          <div className="visit-info">
            <h2 id="visit-heading" className="visit-heading">
              {content.visit.title.split("\n")[0]}
              <br />
              <em>{content.visit.title.split("\n")[1]}</em>
            </h2>
            <address>
              <span>{content.visit.location}</span>
              <span>{content.visit.address}</span>
            </address>
            <div className="visit-links">
              <a
                className="instagram-link"
                href={content.visit.instagram}
                aria-label="DICKISSERIE on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="instagram" />
              </a>
              <a
                className="button primary"
                href={content.visit.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="pin" />
                Get directions
              </a>
            </div>
          </div>
          <div className="visit-map">
            <iframe
              name="venue-map"
              title="DICKISSERIE location — Trakų g. 2, Vilnius"
              src={content.visit.mapsEmbed}
              width="720"
              height="360"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <footer className="site-footer shell">
        <a href="#home" className="footer-wordmark">
          {content.brand}
        </a>
        <p>100% Gourmet. 0% Taboo.</p>
        <a className="text-link" href="#menu">
          Back to the menu
        </a>
      </footer>
    </>
  );
}
