export function gsmUrls(baseUrl: string) {
  const url = `${baseUrl}/gsm`;
  return {
    root: url,
    edit: (gsmId: number) => `${url}/edit/${gsmId}`,
    create: `${url}/create`,
  };
}
