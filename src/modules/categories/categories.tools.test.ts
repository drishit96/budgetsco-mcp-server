import type { Mock } from "vitest";

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as apiUtils from "../../utils/api.utils.js";
import { mockContext } from "../../utils/mock.utils.js";
import * as schema from "./categories.schema.js";
import {
  createCustomCategoriesTool,
  deleteCustomCategoriesTool,
  getCategoriesByTypeTool,
  getCustomCategoriesTool,
} from "./categories.tools.js";

// Mock the API and schema utilities
vi.mock("../../utils/api.utils.js");
vi.mock("./categories.schema.js");

describe("categories.tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategoriesByTypeTool", () => {
    it("should call /categories/get with type and return categories", async () => {
      const mockCategories = ["Food", "Transport"];
      const mockType = { type: "expense" as const };
      (schema.parseTransactionType as Mock).mockReturnValue(mockType);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockCategories });

      const result = await getCategoriesByTypeTool.execute(
        mockType,
        mockContext,
      );

      expect(schema.parseTransactionType).toHaveBeenCalledWith(mockType);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        path: "/categories/get",
        queryParams: { type: [mockType.type] },
      });
      expect(result).toBe(JSON.stringify(mockCategories));
    });

    it("should throw error if transaction type is invalid", async () => {
      const invalidType = { type: "invalid" };
      (schema.parseTransactionType as Mock).mockReturnValue(null);

      await expect(
        getCategoriesByTypeTool.execute(invalidType, mockContext),
      ).rejects.toThrow("Invalid transaction type");
    });
  });

  describe("getCustomCategoriesTool", () => {
    it("should call /categories/custom/get with type and return custom categories", async () => {
      const mockCategories = ["Custom Food", "Custom Transport"];
      const mockType = { type: "expense" as const };
      (schema.parseTransactionType as Mock).mockReturnValue(mockType);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockCategories });

      const result = await getCustomCategoriesTool.execute(
        mockType,
        mockContext,
      );

      expect(schema.parseTransactionType).toHaveBeenCalledWith(mockType);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        path: "/categories/custom/get",
        queryParams: { type: [mockType.type] },
      });
      expect(result).toBe(JSON.stringify(mockCategories));
    });

    it("should throw error if transaction type is invalid", async () => {
      const invalidType = { type: "invalid" };
      (schema.parseTransactionType as Mock).mockReturnValue(null);

      await expect(
        getCustomCategoriesTool.execute(invalidType, mockContext),
      ).rejects.toThrow("Invalid transaction type");
    });
  });

  describe("createCustomCategoriesTool", () => {
    it("should call /categories/custom/create with category details", async () => {
      const mockInput = {
        categories: ["New Category"],
        type: "expense" as const,
      };
      const mockResponse = { id: "123" };
      (schema.parseCustomCategoryActionInput as Mock).mockReturnValue({
        data: mockInput,
        errors: null,
      });
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });

      const result = await createCustomCategoriesTool.execute(
        mockInput,
        mockContext,
      );

      expect(schema.parseCustomCategoryActionInput).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockInput,
        method: "POST",
        path: "/categories/custom/create",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });

    it("should throw error if input is invalid", async () => {
      const invalidInput = { categories: [""], type: "invalid" };
      (schema.parseCustomCategoryActionInput as Mock).mockReturnValue({
        data: null,
        errors: { categories: "Category name is required" },
      });

      await expect(
        createCustomCategoriesTool.execute(invalidInput, mockContext),
      ).rejects.toThrow("Invalid custom category input");
    });
  });

  describe("deleteCustomCategoriesTool", () => {
    it("should call /categories/custom/delete with category details", async () => {
      const mockInput = {
        categories: ["Old Category"],
        type: "expense" as const,
      };
      (schema.parseCustomCategoryActionInput as Mock).mockReturnValue({
        data: mockInput,
        errors: null,
      });
      (apiUtils.callApi as Mock).mockResolvedValue({ data: undefined });

      const result = await deleteCustomCategoriesTool.execute(
        mockInput,
        mockContext,
      );

      expect(schema.parseCustomCategoryActionInput).toHaveBeenCalledWith(
        mockInput,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/categories/custom/delete",
        queryParams: {
          category: mockInput.categories,
          type: [mockInput.type],
        },
      });
      expect(result).toBe(JSON.stringify(undefined));
    });

    it("should throw error if input is invalid", async () => {
      const invalidInput = { categories: [""], type: "invalid" };
      (schema.parseCustomCategoryActionInput as Mock).mockReturnValue({
        data: null,
        errors: { categories: "Category name is required" },
      });

      await expect(
        deleteCustomCategoriesTool.execute(invalidInput, mockContext),
      ).rejects.toThrow("Invalid custom category input");
    });
  });
});
