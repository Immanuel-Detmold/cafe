export const getImagePath = (imgUrl: string) => {
  const url = new URL(imgUrl)
  const pathParts = url.pathname.split('/')
  const imagePath = pathParts.slice(-2).join('/')
  return imagePath // Outputs: "177/cb36a127-6714-40fe-a91c-08d5e51a69e4"
}
