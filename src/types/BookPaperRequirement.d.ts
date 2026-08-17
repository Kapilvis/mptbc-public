declare namespace BookPaperRequirement {
  interface GsmOption {
    gsmId: number;
    title: string;
    reamWeight: number;
  }

  interface Item {
    bookPaperRequirementId: number;
    title: string;
    numberOfBooks: number;
    pagesPerBook: number;
    pagesGsmId: number;
    coverGsmId: number;
    pagesGsmName: string;
    coverGsmName: string;
    innerPaperMt: number;
    coverPaperMt: number;
    createdOn: string;
  }

  interface Form {
    title: string;
    numberOfBooks: number;
    pagesPerBook: number;
    pagesGsmId: number;
    coverGsmId: number;
  }
}
