export function nationalityUrls(baseUrl: string) {
  const url = `${baseUrl}/nationality`;
  return {
    root: url,
    edit: (nationalityId: number) => `${url}/edit/${nationalityId}`,
    create: `${url}/create`,
  };
}
