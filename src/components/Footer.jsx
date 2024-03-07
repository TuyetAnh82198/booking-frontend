import { Container, Form, Button } from "react-bootstrap";

import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div>
      <div style={{ backgroundColor: "#00387f" }}>
        <Container
          className="py-5 col-8 col-lg-4"
          style={{ textAlign: "center", color: "white" }}
        >
          <h2>Save time, save money!</h2>
          <p style={{ marginTop: "1rem" }}>
            Sign up and we'll send the best deals to you
          </p>
          <Form>
            <Form.Group className="d-flex">
              <Form.Control
                className="py-3"
                type="text"
                placeholder="Your Email"
              />
              <Button
                className="py-3"
                style={{
                  marginLeft: "0.8rem",
                  border: "none",
                  backgroundColor: "#0070c1",
                }}
              >
                Subscribe
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </div>
      <Container className="py-4" style={{ color: "#00387f" }}>
        <div className="d-flex justify-content-between">
          <div className={styles.footerItems}>
            <p className={styles.footerItem}>Countries</p>
            <p>Regions</p>
            <p>Cities</p>
            <p>Districts</p>
            <p>Airports</p>
            <p>Hotels</p>
          </div>
          <div className={styles.footerItems}>
            <p>Homes</p>
            <p>Apartments</p>
            <p>Resorts</p>
            <p>Villas</p>
            <p>Hostels</p>
            <p>Guest houses</p>
          </div>
          <div className={styles.footerItems}>
            <p>Unique places to stay</p>
            <p>Reviews</p>
            <p>Unpacked: Travel articles</p>
            <p>Travel communities</p>
            <p>Seasonal and holiday deals</p>
          </div>
          <div className={styles.footerItems}>
            <p>Car rental</p>
            <p>Flight Finder</p>
            <p>Restaurant reservations</p>
            <p>Travel Agents</p>
          </div>
          <div className={styles.footerItems}>
            <p>Curtomer Service</p>
            <p>Partner Help</p>
            <p>Careers</p>
            <p>Sustainability</p>
            <p>Press center</p>
            <p>Safety Resource Center</p>
            <p>Investor relations</p>
            <p>{`Terms & conditions`}</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
