import type { Mock } from "vitest";

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as apiUtils from "../../utils/api.utils.js";
import { mockContext } from "../../utils/mock.utils.js";
import * as schema from "./recurringTransaction.schema.js";
import {
  createRecurringTransactionTool,
  deleteRecurringTransactionTool,
  editRecurringTransactionTool,
  getRecurringTransactionsTool,
  markRecurringTransactionDoneTool,
  skipRecurringTransactionTool,
} from "./recurringTransaction.tools.js";

vi.mock("../../utils/api.utils.js");
vi.mock("./recurringTransaction.schema.js");

describe("recurringTransaction.tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRecurringTransactionsTool", () => {
    it("should call /recurringTransactions/get with filters and return data", async () => {
      const mockFilter = { endDate: "2024-12-31", startDate: "2024-01-01" };
      const parsed = { data: mockFilter, errors: null };
      const mockResponse = [{ id: "abc123" }];
      (schema.parseRecurringTransactionFilter as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await getRecurringTransactionsTool.execute(
        mockFilter,
        mockContext,
      );
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
      await expect(
        getRecurringTransactionsTool.execute(invalid, mockContext),
      ).rejects.toThrow("Invalid filter");
    });
  });

  describe("createRecurringTransactionTool", () => {
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
      const result = await createRecurringTransactionTool.execute(
        mockInput,
        mockContext,
      );
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
      await expect(
        createRecurringTransactionTool.execute(invalid, mockContext),
      ).rejects.toThrow("Invalid transaction");
    });
  });

  describe("editRecurringTransactionTool", () => {
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
      const result = await editRecurringTransactionTool.execute(
        mockInput,
        mockContext,
      );
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
      await expect(
        editRecurringTransactionTool.execute(invalid, mockContext),
      ).rejects.toThrow("Invalid transaction");
    });
  });

  describe("markRecurringTransactionDoneTool", () => {
    it("should call /recurringTransactions/markAsDone with transactionId", async () => {
      const mockInput = { transactionId: "recurring123456" };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { success: true };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await markRecurringTransactionDoneTool.execute(
        mockInput,
        mockContext,
      );
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
      const { markRecurringTransactionDoneTool } = await import(
        "./recurringTransaction.tools.js"
      );
      await expect(
        markRecurringTransactionDoneTool.execute(invalid, mockContext),
      ).rejects.toThrow("Invalid transaction");
    });
  });

  describe("skipRecurringTransactionTool", () => {
    it("should call /recurringTransactions/skip with transactionId", async () => {
      const mockInput = { transactionId: "recurring123456" };
      const parsed = { data: mockInput, errors: null };
      const mockResponse = { success: true };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await skipRecurringTransactionTool.execute(
        mockInput,
        mockContext,
      );
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
      const { skipRecurringTransactionTool } = await import(
        "./recurringTransaction.tools.js"
      );
      await expect(
        skipRecurringTransactionTool.execute(invalid, mockContext),
      ).rejects.toThrow("Invalid transaction");
    });
  });

  describe("deleteRecurringTransactionTool", () => {
    it("should call /recurringTransactions/delete with transactionId", async () => {
      const mockInput = { transactionId: "recurring123456" };
      const parsed = { data: mockInput, errors: null };
      (schema.parseRecurringTransactionActions as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: undefined });
      const result = await deleteRecurringTransactionTool.execute(
        mockInput,
        mockContext,
      );
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
      await expect(
        deleteRecurringTransactionTool.execute(invalid, mockContext),
      ).rejects.toThrow("Invalid transaction");
    });
  });
});
