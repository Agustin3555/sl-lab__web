import { type ImageMetadata } from 'astro'

export type Folder = 'pages'

/*
  "glob" necesita un literal como parametro, por lo tanto no se puede
  refactorizar, como usar los template string.
*/
const assets: Record<Folder, any> = {
  pages: import.meta.glob<{ default: ImageMetadata }>(
    '/src/assets/pages/*.{jpeg,jpg,png,gif,webp,svg}'
  ),
}

export const getImgMetadata = (folder: Folder, file: string) =>
  assets[folder][`/src/assets/${folder}/${file}`]

// Validación de los paths de las imágenes
export const validateImgMetadata = (folder: Folder, file: string) => {
  if (!getImgMetadata(folder, file))
    throw new Error(`"${file}" does not exist in glob: "src/assets/${folder}/"`)
}
