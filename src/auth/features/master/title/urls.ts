export function titleUrls(baseUrl: string) {
  const url = `${baseUrl}/title`;
  return {
    root: url,
    edit: (titleId: number) => `${url}/edit/${titleId}`,
    create: `${url}/create`,
  };
}
