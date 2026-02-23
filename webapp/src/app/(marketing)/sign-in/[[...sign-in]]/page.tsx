import styles from './page.module.css'

export default function SignInPlaceholder() {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.title}>Sign in</h1>
      <p className={styles.body}>Authentication will be available when Clerk is configured (Phase 2).</p>
    </div>
  )
}
