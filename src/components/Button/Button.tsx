import './Button.css'
import { type ButtonHTMLAttributes } from 'react'
import Icon from '../Icon/Icon'

const Input = ({
  text,
  faIcon,
  title,
  extraAttrs,
  handleClick,
}: {
  text?: string
  faIcon?: string
  title?: string
  extraAttrs?: ButtonHTMLAttributes<HTMLButtonElement>
  handleClick?: () => void
}) => (
  <button
    className="cmp-button"
    title={title || text}
    {...extraAttrs}
    onClick={handleClick}
  >
    {text}
    {faIcon && <Icon faIcon={faIcon} />}
  </button>
)

export default Input
