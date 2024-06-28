import './Icon.css'
import { classList } from '@/helpers'

export interface Props {
  faIcon: string
  handlingClass?: string
}

const Icon = ({ faIcon, handlingClass }: Props) => (
  <i className={classList('cmp-icon', faIcon, handlingClass)} />
)

export default Icon
