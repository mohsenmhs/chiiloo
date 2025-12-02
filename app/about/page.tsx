import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'درباره ما - چیلو زعفران ممتاز',
  description: 'درباره چیلو و تعهد ما برای ارائه بهترین کیفیت زعفران بیاموزید. داستان، ارزش‌ها و تعهد ما به تعالی را کشف کنید.',
}

export default function About() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>درباره چیلو</h1>
          <p className={styles.heroSubtitle}>
            مشتاق ارائه بهترین زعفران جهان به شما
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.content}>
            <div className={styles.textSection}>
              <h2 className={styles.sectionTitle}>داستان ما</h2>
              <p className={styles.text}>
                چیلو از علاقه به کیفیت و قدردانی عمیق از هنر آشپزی متولد شد. ما تشخیص دادیم که 
                زعفران، که اغلب "پادشاه ادویه‌ها" نامیده می‌شود، شایسته تهیه و ارائه با 
                بیشترین مراقبت و احترام است.
              </p>
              <p className={styles.text}>
                سفر ما با یک ماموریت ساده آغاز شد: دسترسی به زعفران با کیفیت ممتاز را برای 
                آشپزهای خانگی و سرآشپزهای حرفه‌ای فراهم کنیم. ما هر دسته را با دقت انتخاب می‌کنیم 
                و اطمینان می‌دهیم که فقط بهترین رشته‌ها به آشپزخانه شما می‌رسند.
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
          <h2 className="section-title" style={{ color: 'var(--white)' }}>ارزش‌های ما</h2>
          
          <div className={styles.values}>
            <div className={styles.value}>
              <h3 className={styles.valueTitle}>کیفیت در اولویت</h3>
              <p className={styles.valueText}>
                ما هرگز در کیفیت سازش نمی‌کنیم. هر محصول تحت آزمایش‌های دقیق قرار می‌گیرد 
                تا اطمینان حاصل شود که استانداردهای بالای ما را برآورده می‌کند.
              </p>
            </div>
            
            <div className={styles.value}>
              <h3 className={styles.valueTitle}>اصالت</h3>
              <p className={styles.valueText}>
                ما مستقیماً از کشاورزان مورد اعتماد تهیه می‌کنیم و اصالت و 
                قابلیت ردیابی را در هر خرید تضمین می‌کنیم.
              </p>
            </div>
            
            <div className={styles.value}>
              <h3 className={styles.valueTitle}>پایداری</h3>
              <p className={styles.valueText}>
                ما متعهد به شیوه‌های پایدار هستیم که از جوامع محلی حمایت می‌کند 
                و از محیط زیست محافظت می‌کند.
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
              <h2 className={styles.sectionTitle}>چرا زعفران؟</h2>
              <p className={styles.text}>
                زعفران بیش از یک ادویه است—نمادی از لوکس، سنت و برتری آشپزی است. 
                با طعم متمایز، رنگ زنده و خواص معطر، زعفران برای هزاران سال گرامی داشته شده است.
              </p>
              <p className={styles.text}>
                در چیلو، ما معتقدیم که همه باید به زعفران ممتازی دسترسی داشته باشند که 
                آشپزی آنها را ارتقا دهد. چه در حال آماده کردن یک وعده غذایی خاص باشید یا 
                در حال آزمایش دستورهای جدید، زعفران ما آن لمس کامل از ظرافت و طعم را اضافه می‌کند.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

