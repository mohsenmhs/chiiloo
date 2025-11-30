import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About Us - Chiiloo Premium Saffron',
  description: 'Learn about Chiiloo and our commitment to providing the finest quality saffron. Discover our story, values, and dedication to excellence.',
}

export default function About() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>About Chiiloo</h1>
          <p className={styles.heroSubtitle}>
            Passionate about bringing you the world's finest saffron
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.content}>
            <div className={styles.textSection}>
              <h2 className={styles.sectionTitle}>Our Story</h2>
              <p className={styles.text}>
                Chiiloo was born from a passion for quality and a deep appreciation for the 
                culinary arts. We recognized that saffron, often called the "king of spices," 
                deserves to be sourced and presented with the utmost care and respect.
              </p>
              <p className={styles.text}>
                Our journey began with a simple mission: to make premium quality saffron 
                accessible to home cooks and professional chefs alike. We carefully select 
                each batch, ensuring that only the finest threads make it to your kitchen.
              </p>
            </div>
            
            <div className={styles.imagePlaceholder}>
              <div className={styles.saffronPattern}></div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.valuesSection} section`}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--white)' }}>Our Values</h2>
          
          <div className={styles.values}>
            <div className={styles.value}>
              <h3 className={styles.valueTitle}>Quality First</h3>
              <p className={styles.valueText}>
                We never compromise on quality. Every product undergoes rigorous testing 
                to ensure it meets our high standards.
              </p>
            </div>
            
            <div className={styles.value}>
              <h3 className={styles.valueTitle}>Authenticity</h3>
              <p className={styles.valueText}>
                We source directly from trusted growers, ensuring authenticity and 
                traceability in every purchase.
              </p>
            </div>
            
            <div className={styles.value}>
              <h3 className={styles.valueTitle}>Sustainability</h3>
              <p className={styles.valueText}>
                We are committed to sustainable practices that support local communities 
                and protect the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.content}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.saffronPattern}></div>
            </div>
            
            <div className={styles.textSection}>
              <h2 className={styles.sectionTitle}>Why Saffron?</h2>
              <p className={styles.text}>
                Saffron is more than just a spice—it's a symbol of luxury, tradition, 
                and culinary excellence. With its distinctive flavor, vibrant color, 
                and aromatic properties, saffron has been treasured for thousands of years.
              </p>
              <p className={styles.text}>
                At Chiiloo, we believe that everyone should have access to premium saffron 
                that elevates their cooking. Whether you're preparing a special meal or 
                experimenting with new recipes, our saffron will add that perfect touch 
                of elegance and flavor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

