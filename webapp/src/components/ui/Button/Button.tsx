'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  /** When provided, renders as a Next.js Link */
  href?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      href,
      icon,
      iconPosition = 'left',
      fullWidth,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const classes = [
      styles.button,
      styles[`variant_${variant}`],
      styles[`size_${size}`],
      fullWidth && styles.fullWidth,
      icon && iconPosition === 'right' && styles.iconRight,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {icon && <span className={styles.icon}>{icon}</span>}
          <span>{children}</span>
        </Link>
      )
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)
