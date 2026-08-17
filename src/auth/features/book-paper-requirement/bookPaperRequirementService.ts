import { useMemo } from "react";
import { useAppForm } from "shared/hooks/form";
import { useFormServerError } from "auth/hooks/useFormServerError";
import validation from "shared/utils/validation";
import { ApiService } from "services";
import { calculatePaperRequirement } from "./utils/paperCalculation";
import { bookPaperRequirementSchema } from "./schemas/bookPaperRequirementSchema";
import { initialRequirements, initialGsmOptions } from "./data/bookPaperData";

// Toggle this flag to switch between mock memory storage and live backend API endpoints!
const USE_MOCK = true;

// In-memory list for book paper requirements mock/fallback
let mockRequirements: BookPaperRequirement.Item[] = [...initialRequirements];
const mockGsmOptions: BookPaperRequirement.GsmOption[] = [...initialGsmOptions];

// API functions
export async function getGsmOptions(): Promise<
  BookPaperRequirement.GsmOption[]
> {
  if (USE_MOCK) {
    return mockGsmOptions;
  }
  return ApiService.getList<BookPaperRequirement.GsmOption>("gsm");
}

export async function getBookPaperRequirements(): Promise<
  BookPaperRequirement.Item[]
> {
  if (USE_MOCK) {
    return [...mockRequirements];
  }
  return ApiService.getList<BookPaperRequirement.Item>(
    "book-paper-requirement",
  );
}

export async function createBookPaperRequirement(
  data: Omit<BookPaperRequirement.Item, "bookPaperRequirementId" | "createdOn">,
): Promise<BookPaperRequirement.Item> {
  if (!USE_MOCK) {
    const result = await ApiService.post<BookPaperRequirement.Item>(
      "book-paper-requirement",
      data,
    );
    if (result && !result.error && result.data) {
      return result.data;
    }
  }

  const newItem: BookPaperRequirement.Item = {
    bookPaperRequirementId: Date.now(),
    ...data,
    createdOn: new Date().toISOString(),
  };
  mockRequirements.push(newItem);
  return newItem;
}

export async function updateBookPaperRequirement(
  id: number,
  data: Omit<BookPaperRequirement.Item, "bookPaperRequirementId" | "createdOn">,
): Promise<BookPaperRequirement.Item> {
  if (!USE_MOCK) {
    const result = await ApiService.put<BookPaperRequirement.Item>(
      `book-paper-requirement/${id}`,
      data,
    );
    if (result && !result.error && result.data) {
      return result.data;
    }
  }

  const index = mockRequirements.findIndex(
    (r) => r.bookPaperRequirementId === id,
  );
  if (index === -1) throw new Error("Record not found");
  const updatedItem: BookPaperRequirement.Item = {
    ...mockRequirements[index],
    ...data,
  };
  mockRequirements[index] = updatedItem;
  return updatedItem;
}

export async function deleteBookPaperRequirement(id: number): Promise<boolean> {
  if (!USE_MOCK) {
    const result = await ApiService.del<boolean>(
      `book-paper-requirement/${id}`,
    );
    if (result && !result.error) {
      return true;
    }
  }

  const initialLength = mockRequirements.length;
  mockRequirements = mockRequirements.filter(
    (r) => r.bookPaperRequirementId !== id,
  );
  return mockRequirements.length < initialLength;
}

// Custom hook for form control and live calculations
export function useBookPaperRequirement(
  submitCallback: (data: BookPaperRequirement.Form) => Promise<void>,
  gsmOptions: BookPaperRequirement.GsmOption[],
  defaultValues?: BookPaperRequirement.Form,
) {
  const form = useAppForm<BookPaperRequirement.Form>({
    defaultValues: defaultValues ? async () => defaultValues : undefined,
    resolver: validation.resolver(bookPaperRequirementSchema),
  });

  useFormServerError(form);

  const { register, handleSubmit, reset, setValue, watch } = form;

  const numberOfBooks = watch("numberOfBooks");
  const pagesPerBook = watch("pagesPerBook");
  const pagesGsmId = watch("pagesGsmId");
  const coverGsmId = watch("coverGsmId");

  const liveCalculations = useMemo(() => {
    if (
      !numberOfBooks ||
      !pagesPerBook ||
      !pagesGsmId ||
      !coverGsmId ||
      gsmOptions.length === 0
    ) {
      return { innerPaperMt: 0, coverPaperMt: 0 };
    }

    const pagesGsm = gsmOptions.find((g) => g.gsmId === Number(pagesGsmId));
    const coverGsm = gsmOptions.find((g) => g.gsmId === Number(coverGsmId));

    if (!pagesGsm || !coverGsm) {
      return { innerPaperMt: 0, coverPaperMt: 0 };
    }

    return calculatePaperRequirement(
      Number(numberOfBooks),
      Number(pagesPerBook),
      pagesGsm.reamWeight,
      coverGsm.reamWeight,
    );
  }, [numberOfBooks, pagesPerBook, pagesGsmId, coverGsmId, gsmOptions]);

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    setValue,
    watch,
    liveCalculations,
  };
}
