export function designationUrls(baseUrl: string) {
  const url = `${baseUrl}/designation`;
  return {
    root: url,
    edit: (designationId: number) => `${url}/edit/${designationId}`,
    create: `${url}/create`,
  };
}
