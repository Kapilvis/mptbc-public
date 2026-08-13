export function bookTypeUrls(baseUrl: string) {
  const url = `${baseUrl}/book-type`;
  return {
    root: url,
    edit: (bookTypeId: number) => `${url}/edit/${bookTypeId}`,
    create: `${url}/create`,
  };
}
