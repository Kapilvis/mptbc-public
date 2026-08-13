export function religionUrls(baseUrl: string) {
  const url = `${baseUrl}/religion`;
  return {
    root: url,
    edit: (religionId: number) => `${url}/edit/${religionId}`,
    create: `${url}/create`,
  };
}
