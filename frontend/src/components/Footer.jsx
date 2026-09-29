import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="page-width">
        <div className="footer__content-top">
          <div className="footer-block">
            <h2 className="footer-block__heading">About Us</h2>
            <div className="footer-block__details-content">
              <p>URBAN T-SHIRTS brings bold printed designs, comfortable fits and affordable everyday fashion.</p>
            </div>
          </div>
          <div className="footer-block">
            <h2 className="footer-block__heading">Customer Care</h2>
            <ul className="footer-block__details-content">
              <li><a href="https://wa.me/917603871293">WhatsApp: +91 7603871293</a></li>
              <li><a href="https://wa.me/919952391001">WhatsApp: +91 9952391001</a></li>
              <li><a href="https://instagram.com/_urban_tshirts">Instagram</a></li>
            </ul>
          </div>
          <div className="footer-block">
            <h2 className="footer-block__heading">Policies</h2>
            <ul className="footer-block__details-content">
              <li>Delivery: 3-4 days</li>
              <li>Returns: Damaged pieces only</li>
            </ul>
          </div>
        </div>
        <div className="footer__content-bottom">
          <p>&copy; 2026 URBAN T-SHIRTS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
