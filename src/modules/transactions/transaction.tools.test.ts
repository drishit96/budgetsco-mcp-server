import type { Mock } from "vitest";

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as apiUtils from "../../utils/api.utils.js";
import * as schema from "./transaction.schema.js";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransactions,
} from "./transaction.tools.js";

vi.mock("../../utils/api.utils.js");
vi.mock("./transaction.schema.js");

describe("transaction.tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTransactions", () => {
    it("should call /transactions/get with filters and return data", async () => {
      const mockFilter = {
        categories: ["Food"],
        endDate: "2024-12-31",
        startDate: "2024-01-01",
        types: ["expense"],
      };
      const parsed = { data: mockFilter, errors: null };
      const mockResponse = [{ id: "txn1" }];
      (schema.parseTransactionFilter as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await getTransactions(mockFilter);
      expect(schema.parseTransactionFilter).toHaveBeenCalledWith(mockFilter);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        path: "/transactions/get",
        queryParams: {
          category: mockFilter.categories,
          endDate: [mockFilter.endDate],
          startDate: [mockFilter.startDate],
          type: mockFilter.types,
        },
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if filter is invalid", async () => {
      const invalid = { foo: "bar" };
      (schema.parseTransactionFilter as Mock).mockReturnValue({
        data: null,
        errors: { foo: "bad" },
      });
      await expect(getTransactions(invalid)).rejects.toThrow("Invalid filter");
    });
  });

  describe("createTransaction", () => {
    it("should call /transactions/create with transaction and return data", async () => {
      const mockInput = {
        amount: 100,
        category: "Food",
        paymentMode: "Cash",
        type: "expense",
      };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { id: "txn2" };
      (schema.parseTransactionInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await createTransaction(mockInput);
      expect(schema.parseTransactionInput).toHaveBeenCalledWith(mockInput);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/transactions/create",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { amount: 0 };
      (schema.parseTransactionInput as Mock).mockReturnValue({
        data: null,
        errors: { amount: "bad" },
      });
      await expect(createTransaction(invalid)).rejects.toThrow("Invalid input");
    });
  });

  describe("editTransaction", () => {
    it("should call /transactions/edit with transaction and return data", async () => {
      const mockInput = {
        amount: 200,
        category: "Bills",
        paymentMode: "UPI",
        type: "expense",
      };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { id: "txn3" };
      (schema.parseTransactionInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await editTransaction(mockInput);
      expect(schema.parseTransactionInput).toHaveBeenCalledWith(mockInput);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/transactions/edit",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { amount: 0 };
      (schema.parseTransactionInput as Mock).mockReturnValue({
        data: null,
        errors: { amount: "bad" },
      });
      await expect(editTransaction(invalid)).rejects.toThrow("Invalid input");
    });
  });

  describe("deleteTransaction", () => {
    it("should call /transactions/delete with transactionId and return data", async () => {
      const mockInput = { transactionId: "txn123456789012" };
      const parsed = { data: mockInput, errors: null };
      (schema.parseTransactionDeleteInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: undefined });
      const result = await deleteTransaction(mockInput);
      expect(schema.parseTransactionDeleteInput).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/transactions/delete",
        queryParams: { transactionId: [mockInput.transactionId] },
      });
      expect(result).toBe(JSON.stringify(undefined));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { transactionId: "bad" };
      (schema.parseTransactionDeleteInput as Mock).mockReturnValue({
        data: null,
        errors: { transactionId: "bad" },
      });
      await expect(deleteTransaction(invalid)).rejects.toThrow(
        "Invalid transaction",
      );
    });
  });
});
