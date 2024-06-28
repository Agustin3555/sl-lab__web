import './InputField.css'
import { Icon } from '@/components'
import { type ChangeEventHandler } from 'react'

const InputField = ({
  id,
  title,
  value,
  min,
  max,
  readonly = false,
  handleChange,
}: {
  id: string
  title: string
  value: number
  min?: number
  max?: number
  readonly?: boolean
  handleChange: ChangeEventHandler<HTMLInputElement>
}) => (
  <label className="cmp-input-field">
    {title}
    <div className="group">
      {min !== undefined && (
        <div className="min">
          <div className="icon">
            <Icon faIcon="fa-solid fa-angle-up" />
            <span />
          </div>
          <small>{min}</small>
        </div>
      )}
      {max !== undefined && (
        <div className="max">
          <div className="icon">
            <span />
            <Icon faIcon="fa-solid fa-angle-up" />
          </div>
          <small>{max}</small>
        </div>
      )}
      <input
        id={id}
        value={isNaN(value) ? '' : value}
        type="number"
        readOnly={readonly}
        onChange={handleChange}
        style={{
          ['--cmp-input-field-color']: `var(--pal-color-base-${
            (min === undefined || min <= value) &&
            (max === undefined || value <= max)
              ? 'a'
              : 'b'
          })`,
        }}
      />
    </div>
  </label>
)

export default InputField
