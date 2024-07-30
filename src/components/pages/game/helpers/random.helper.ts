export const randomInt = ({ min = 0, max }: { min?: number; max: number }) => {
  // Aseguramos que el mínimo sea menor o igual al máximo
  if (min > max) [min, max] = [max, min]

  const range = max - min + 1

  return Math.floor(Math.random() * range) + min
}

export const dropRandom = <T>(elements: T[]) =>
  elements[randomInt({ max: elements.length - 1 })]

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
