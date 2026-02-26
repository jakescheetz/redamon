import { SignUp } from '@clerk/nextjs'
import styles from './page.module.css'

export default function SignUpPage() {
  return (
    <div className={styles.authContainer}>
      <SignUp />
    </div>
  )
}
