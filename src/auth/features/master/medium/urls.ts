export function mediumUrls(baseUrl: string) {
  const url = `${baseUrl}/medium`;
  return {
    root: url,
    edit: (mediumId: number) => `${url}/edit/${mediumId}`,
    create: `${url}/create`,
  };
}
