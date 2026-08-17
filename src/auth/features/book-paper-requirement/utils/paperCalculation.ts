export const calculatePaperRequirement = (
  numberOfBooks: number,
  pagesPerBook: number,
  pagesReamWeight: number,
  coverReamWeight: number,
) => {
  const innerPaperMt =
    (((numberOfBooks * pagesPerBook) / (16 * 500)) * 1.03 * pagesReamWeight) /
    1000;

  const coverPaperMt =
    (numberOfBooks * coverReamWeight * 1.02) / (4 * 500 * 1000);

  return {
    innerPaperMt: Number(innerPaperMt.toFixed(3)),
    coverPaperMt: Number(coverPaperMt.toFixed(3)),
  };
};
