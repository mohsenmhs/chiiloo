import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '4rem 2rem',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: 800,
        color: 'var(--saffron-purple)',
        marginBottom: '1rem'
      }}>
        ۴۰۴
      </h1>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 700,
        color: 'var(--gray-dark)',
        marginBottom: '1rem'
      }}>
        محصول یافت نشد
      </h2>
      <p style={{ 
        color: 'var(--gray-dark)',
        marginBottom: '2rem',
        fontSize: '1.1rem'
      }}>
        متأسفانه محصول مورد نظر شما یافت نشد.
      </p>
      <Link 
        href="/products/" 
        style={{
          background: 'linear-gradient(135deg, var(--saffron-red) 0%, var(--saffron-purple) 100%)',
          color: 'var(--white)',
          padding: '1rem 2rem',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1.1rem',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        بازگشت به محصولات
      </Link>
    </div>
  )
}

