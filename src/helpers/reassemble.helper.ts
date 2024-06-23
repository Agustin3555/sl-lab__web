/*
  Se ha utilizado Record<string, any> como restricción genérica para T, lo que
  indica que T debe ser un objeto con claves de tipo string y valores de cualquier
  tipo.

  El parámetro key en la función de callback ahora se tipa como keyof T, lo que
  garantiza que solo se puedan pasar claves válidas del objeto T.

  El parámetro current en la función de callback se tipa como T[keyof T], lo que
  asegura que el tipo del valor pasado corresponda al tipo del valor asociado con la
  clave en el objeto T.

  El tipo de retorno de la función reassemble se ha especificado como R[], donde R
  es el tipo de retorno de la función de callback.
*/
export const reassemble = <T extends Record<string, any>, R>(
  object: T,
  callback: (key: keyof T, current: T[keyof T], index: number) => R
): R[] => {
  const result: R[] = []

  Object.keys(object).forEach((key, index) => {
    const typedKey = key as keyof T
    const currentValue = object[typedKey]

    const callbackResult = callback(typedKey, currentValue, index)

    result.push(callbackResult)
  })

  return result
}
