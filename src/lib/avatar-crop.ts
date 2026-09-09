export async function cropImageToSquare(file: File): Promise<File> {
  const image = await createImageBitmap(file);
  const size = Math.min(image.width, image.height);
  const sx = Math.floor((image.width - size) / 2);
  const sy = Math.floor((image.height - size) / 2);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(image, sx, sy, size, size, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, file.type || "image/jpeg", 0.9);
  });

  if (!blob) {
    return file;
  }

  return new File([blob], file.name, { type: blob.type });
}
