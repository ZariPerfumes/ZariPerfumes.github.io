import { useApp } from '../AppContext';

export default function WhatsAppButton() {
  const { lang } = useApp();
  const whatsappUrl = "https://wa.me/971588537024";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000,
        textDecoration: 'none',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <span style={{ 
        fontFamily: 'serif',
        letterSpacing: '1px',
        fontSize: '11px', 
        color: '#000000',
        textTransform: 'uppercase',
        fontWeight: '500',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}>
        {lang === 'en' ? 'Need Help?' : 'تحتاج مساعدة؟'}
      </span>
      <div style={{
        width: '55px',
        height: '55px',
        backgroundColor: '#1a1a1a',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        border: '1px solid #9333EA'
      }}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#9333EA" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </a>
  );
}