export function classUrls(baseUrl: string) {
  const url = `${baseUrl}/class`;
  return {
    root: url,
    edit: (classId: number) => `${url}/edit/${classId}`,
    create: `${url}/create`,
  };
}
