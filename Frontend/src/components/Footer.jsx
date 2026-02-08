function Footer() {
  return (
    <footer
      className="footer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid color-mix(in srgb, var(--border) 20%, transparent)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '0.75rem',
          opacity: 0.4,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        © 2026 Care Maa · Maternal & Child Health
      </p>
    </footer>
  );
}

export default Footer;
