export function paperLabTestingUrls(baseUrl: string = "/paper/lab-testing") {
  return {
    root: baseUrl,
    create: `${baseUrl}/create`,
    edit: (id: string | number) => `${baseUrl}/edit/${id}`,
    receive: (id: string | number) => `${baseUrl}/receive/${id}`,
  };
}
