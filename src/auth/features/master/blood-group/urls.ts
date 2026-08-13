export function bloodGroupUrls(baseUrl: string) {
  const url = `${baseUrl}/blood-group`;
  return {
    root: url,
    edit: (bloodGroupId: number) => `${url}/edit/${bloodGroupId}`,
    create: `${url}/create`,
  };
}
