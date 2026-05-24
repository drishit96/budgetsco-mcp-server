import type { Mock } from "vitest";

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as apiUtils from "../../utils/api.utils.js";
import * as schema from "./recurringTransaction.schema.js";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  editRecurringTransaction,
  getRecurringTransactions,
  markRecurringTransactionDone,
  skipRecurringTransaction,
} from "./recurringTransaction.tools.js";

vi.mock("../../utils/api.utils.js");
vi.mock("./recurringTransaction.schema.js");

describe("recurringTransaction.tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRecurringTransactions", () => {
    it("should call /recurringTransactions/get with filters and return data", async () => {
      const mockFilter = { endDate: "2024-12-31", startDate: "2024-01-01" };
      const parsed = { data: mockFilter, errors: null };
      const mockResponse = [{ id: "abc123" }];
      (schema.parseRecurringTransactionFilter as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await getRecurringTransactions(mockFilter);
      expect(schema.parseRecurringTransactionFilter).toHaveBeenCalledWith(
        mockFilter,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        path: "/recurringTransactions/get",
        queryParams: {
          endDate: [mockFilter.endDate],
          startDate: [mockFilter.startDate],
        },
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if filter is invalid", async () => {
      const invalid = { foo: "bar" };
      (schema.parseRecurringTransactionFilter as Mock).mockReturnValue({
        data: null,
        errors: { foo: "bad" },
      });
      await expect(getRecurringTransactions(invalid)).rejects.toThrow(
        "Invalid filter",
      );
    });
  });

  describe("createRecurringTransaction", () => {
    it("should call /recurringTransactions/create with transaction", async () => {
      const mockInput = {
        amount: 100,
        category: "Food",
        interval: 1,
        occurrence: "month",
        paymentMode: "Cash",
        type: "expense",
      };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { id: "rec1" };
      (schema.parseRecurringTransactionInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await createRecurringTransaction(mockInput);
      expect(schema.parseRecurringTransactionInput).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/recurringTransactions/create",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { amount: 0 };
      (schema.parseRecurringTransactionInput as Mock).mockReturnValue({
        data: null,
        errors: { amount: "bad" },
      });
      await expect(createRecurringTransaction(invalid)).rejects.toThrow(
        "Invalid transaction",
      );
    });
  });

  describe("editRecurringTransaction", () => {
    it("should call /recurringTransactions/edit with transaction", async () => {
      const mockInput = {
        amount: 200,
        category: "Bills",
        interval: 2,
        occurrence: "month",
        paymentMode: "UPI",
        type: "expense",
      };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { id: "rec2" };
      (schema.parseRecurringTransactionInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await editRecurringTransaction(mockInput);
      expect(schema.parseRecurringTransactionInput).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/recurringTransactions/edit",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { amount: 0 };
      (schema.parseRecurringTransactionInput as Mock).mockReturnValue({
        data: null,
        errors: { amount: "bad" },
      });
      await expect(editRecurringTransaction(invalid)).rejects.toThrow(
        "Invalid transaction",
      );
    });
  });

  describe("markRecurringTransactionDone", () => {
    it("should call /recurringTransactions/markAsDone with transactionId", async () => {
      const mockInput = { transactionId: "recurring123456" };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { success: true };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await markRecurringTransactionDone(mockInput);
      expect(schema.parseRecurringTransactionActions).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/recurringTransactions/markAsDone",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { transactionId: "bad" };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue({
        data: null,
        errors: { transactionId: "bad" },
      });
      await expect(markRecurringTransactionDone(invalid)).rejects.toThrow(
        "Invalid transaction",
      );
    });
  });

  describe("skipRecurringTransaction", () => {
    it("should call /recurringTransactions/skip with transactionId", async () => {
      const mockInput = { transactionId: "recurring123456" };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { success: true };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await skipRecurringTransaction(mockInput);
      expect(schema.parseRecurringTransactionActions).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/recurringTransactions/skip",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { transactionId: "bad" };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue({
        data: null,
        errors: { transactionId: "bad" },
      });
      await expect(skipRecurringTransaction(invalid)).rejects.toThrow(
        "Invalid transaction",
      );
    });
  });

  describe("deleteRecurringTransaction", () => {
    it("should call /recurringTransactions/delete with transactionId", async () => {
      const mockInput = { transactionId: "recurring123456" };
      const parsed = { data: mockInput, errors: null };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: undefined });
      const result = await deleteRecurringTransaction(mockInput);
      expect(schema.parseRecurringTransactionActions).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/recurringTransactions/delete",
        queryParams: { transactionId: [mockInput.transactionId] },
      });
      expect(result).toBe(JSON.stringify(undefined));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { transactionId: "bad" };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue({
        data: null,
        errors: { transactionId: "bad" },
      });
      await expect(deleteRecurringTransaction(invalid)).rejects.toThrow(
        "Invalid transaction",
      );
    });
  });
});
