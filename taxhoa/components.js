/**
 * TaxHoa Document Components
 * Standard Web Components for TaxHoa HR Document Suite
 */

class TaxhoaHeader extends HTMLElement {
  connectedCallback() {
    const date = this.getAttribute("date") || "July 07, 2023";
    this.innerHTML = `
      <div class="top-solid-stripe" aria-hidden="true"></div>
      <header class="letterhead">
        <div class="brand-block">
          <img src="logo.svg" alt="TaxHoa Logo" class="brand-logo">
          <span class="brand-tagline">Tax Accounting, Simplified</span>
        </div>
        <div class="meta-block">
          <div class="meta-row">
            <span class="meta-label">Date:</span>
            <span class="meta-value">${date}</span>
          </div>
        </div>
      </header>
    `;
  }
}

class TaxhoaSignatory extends HTMLElement {
  connectedCallback() {
    const candidateSign = this.getAttribute("candidate-sign");
    const founderTitle = this.getAttribute("founder-title") || "Founder & CEO";
    const founderName = this.getAttribute("founder-name") || "Sachin";
    const company = this.getAttribute("company") || "TaxHoa (Amoeba Global FZ-LLC)";

    if (candidateSign) {
      // Dual signatory layout (e.g. Offer Letter)
      this.innerHTML = `
        <div class="dual-signatory-section">
          <div class="employer-sign-block">
            <div class="seal-sign-row">
              <img src="seal.png" alt="Official Organization Seal" class="seal-img">
              <img src="sign.png" alt="Authorized Signature" class="sign-img">
            </div>
            <div class="signatory-info">
              <div class="signatory-name">${founderName}</div>
              <div class="signatory-role">${founderTitle}</div>
              <div class="signatory-org">${company}</div>
            </div>
          </div>
          <div class="candidate-sign-block">
            <img src="${candidateSign}" alt="Candidate Signature" class="candidate-sign-img">
            <div class="candidate-label">Signature of the Candidate</div>
          </div>
        </div>
      `;
    } else {
      // Single founder signatory layout (Relieving & Experience Letters)
      this.innerHTML = `
        <div class="signatory-block">
          <div class="seal-sign-row">
            <img src="seal.png" alt="Official Organization Seal" class="seal-img">
            <img src="sign.png" alt="Authorized Signature" class="sign-img">
          </div>
          <div class="signatory-info">
            <div class="signatory-name">${founderName}</div>
            <div class="signatory-role">${founderTitle}</div>
            <div class="signatory-org">${company}</div>
          </div>
        </div>
      `;
    }
  }
}

class TaxhoaFooter extends HTMLElement {
  connectedCallback() {
    const address = this.getAttribute("address") || "Ras Al Khaimah, 10055, AE";
    const email = this.getAttribute("email") || "support@taxhoa.com";

    this.innerHTML = `
      <footer class="letter-footer">
        <div class="footer-row">
          <div class="footer-left">${address}</div>
          <div class="footer-right">
            <a href="mailto:${email}" class="footer-email">${email}</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("taxhoa-header", TaxhoaHeader);
customElements.define("taxhoa-signatory", TaxhoaSignatory);
customElements.define("taxhoa-footer", TaxhoaFooter);
