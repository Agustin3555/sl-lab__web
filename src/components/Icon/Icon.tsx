import './Icon.css'
import { classList } from '../../helpers/classList.helper'

export interface Props {
  faIcon: string
  handlingClass?: string
}

const Icon = ({ faIcon, handlingClass }: Props) => (
  <i className={classList('icon', faIcon, handlingClass)} />
)

export default Icon
