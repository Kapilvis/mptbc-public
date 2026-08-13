export function casteUrls(baseUrl: string) {
  const url = `${baseUrl}/caste`;
  return {
    root: url,
    edit: (casteId: number) => `${url}/edit/${casteId}`,
    create: `${url}/create`,
  };
}
