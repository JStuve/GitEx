import clsx from 'clsx'
import './Button.scss'
import { type ReactNode } from 'react'

export interface ButtonProps {
  className?: string[]
  child: string | JSX.Element
  handleClick?: () => void
  variant?: 'no-style'
  title?: string
}
function Button (props: ButtonProps): ReactNode {
  return (
    <button
      className={clsx('button', ...(props?.className ?? []),
        {
          'button--no-style': props.variant === 'no-style'
        })}
      onClick={props.handleClick}
      title={props?.title}
    >
      {props.child}
    </button>
  )
}

export default Button
