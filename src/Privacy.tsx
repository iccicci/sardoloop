import { Link } from "react-router-dom";

export const PrivacyPolicy = () => <div style={{ lineHeight: 1.6, margin: "0 auto", maxWidth: 800, padding: 24 }}>
  <h1>Privacy Policy</h1>
  <h2>Italiano</h2>
  <p>Questo sito utilizza Google AdSense per la visualizzazione di annunci pubblicitari.</p>
  <p>Google e i suoi partner possono utilizzare cookie per:</p>
  <ul>
    <li>mostrare annunci personalizzati e non personalizzati</li>
    <li>misurare le performance degli annunci</li>
    <li>migliorare l'esperienza pubblicitaria</li>
  </ul>
  <p>
      Per maggiori informazioni su come Google utilizza i dati:
    <br />
    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
        https://policies.google.com/technologies/ads
    </a>
    <br />
    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
        https://policies.google.com/privacy
    </a>
  </p>
  <p>
      L'utente può gestire o disattivare la personalizzazione degli annunci tramite:
    <br />
    <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
        https://adssettings.google.com/
    </a>
  </p>
  <p>Continuando a utilizzare il sito, l'utente acconsente all'uso dei cookie secondo le modalità descritte sopra.</p>
  <hr />
  <h2>English</h2>
  <p>This website uses Google AdSense to display advertisements.</p>
  <p>Google and its partners may use cookies to:</p>
  <ul>
    <li>serve personalized and non-personalized ads</li>
    <li>measure ad performance</li>
    <li>improve advertising experience</li>
  </ul>
  <p>
      For more information on how Google uses data:
    <br />
    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
        https://policies.google.com/technologies/ads
    </a>
    <br />
    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
        https://policies.google.com/privacy
    </a>
  </p>
  <p>
      Users can manage or disable ad personalization here:
    <br />
    <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
        https://adssettings.google.com/
    </a>
  </p>
  <p>By continuing to use this site, the user consents to the use of cookies as described above.</p>
  <br />
  <hr />
  <br />
  <Link to={"/it/sardoloop"}>Versione italiana</Link>
  {" - "}
  <Link to={"/en/sardoloop"}>English version</Link>
</div>;
