import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{
      width: '100%',
      backgroundColor: 'black',
      color: '#9ca3af',
      padding: '60px 40px 30px 40px',
      marginTop: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px',
        rowGap: '40px'
      }}>
        {/* Logo and Copyright Section */}
        <div style={{
          flex: 2,
          minWidth: '200px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            TourEase
          </h2>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#9ca3af'
          }}>
            Elevating Nigerian Hospitality with unparalleled luxury and local expertise.
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '20px'
          }}>
            © 2025 TourEase. All Rights Reserved.
          </p>
        </div>

        {/* Quick Links Section */}
        <div style={{
          flex: 1,
          minWidth: '150px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            Quick Links
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link to="/about" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Our Story
            </Link>
            <Link to="/destinations" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Destinations
            </Link>
            <Link to="/hotels" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Hotels
            </Link>
          </div>
        </div>

        {/* Legal Section */}
        <div style={{
          flex: 1,
          minWidth: '150px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            Legal
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link to="/terms" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Terms of Service
            </Link>
            <Link to="/privacy" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          flex: 1,
          minWidth: '150px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px'
          }}>
            Support
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link to="/contact" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Contact Us
            </Link>
            <Link to="/faq" style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#7d5800'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;