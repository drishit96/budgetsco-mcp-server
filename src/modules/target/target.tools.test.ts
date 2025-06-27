import type { Mock } from "vitest";

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as apiUtils from "../../utils/api.utils.js";
import { mockContext } from "../../utils/mock.utils.js";
import * as schema from "./target.schema.js";
import { getBudgetTool, setBudgetTool } from "./target.tools.js";

vi.mock("../../utils/api.utils.js");
vi.mock("./target.schema.js");

describe("target.tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBudgetTool", () => {
    it("should call /target/get with filters and return data", async () => {
      const mockFilter = {
        breakDownByCategory: true,
        endMonth: "2024-12",
        startMonth: "2024-01",
      };
      const parsed = { data: mockFilter, errors: null };
      const mockResponse = { breakdown: { Food: 500, Rent: 500 }, total: 1000 };
      (schema.parseBudgetFilterInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await getBudgetTool.execute(mockFilter, mockContext);
      expect(schema.parseBudgetFilterInput).toHaveBeenCalledWith(mockFilter);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        path: "/target/get",
        queryParams: {
          breakDownByCategory: [String(mockFilter.breakDownByCategory)],
          endMonth: [mockFilter.endMonth],
          startMonth: [mockFilter.startMonth],
        },
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if filter is invalid", async () => {
      const invalid = { foo: "bar" };
      (schema.parseBudgetFilterInput as Mock).mockReturnValue({
        data: null,
        errors: { foo: "bad" },
      });
      await expect(getBudgetTool.execute(invalid, mockContext)).rejects.toThrow(
        "Invalid filter",
      );
    });
  });

  describe("setBudgetTool", () => {
    it("should call /target/set with budget and return data", async () => {
      const mockInput = { breakdown: { Food: 500, Rent: 500 } };
      const parsed = { data: { ...mockInput, total: 1000 }, errors: null };
      const mockResponse = { success: true };
      (schema.parseBudgetInput as Mock).mockReturnValue(parsed);
      (apiUtils.callApi as Mock).mockResolvedValue({ data: mockResponse });
      const result = await setBudgetTool.execute(mockInput, mockContext);
      expect(schema.parseBudgetInput).toHaveBeenCalledWith(mockInput);
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: parsed.data,
        method: "POST",
        path: "/target/set",
      });
      expect(result).toBe(JSON.stringify(mockResponse));
    });
    it("should throw error if input is invalid", async () => {
      const invalid = { breakdown: {} };
      (schema.parseBudgetInput as Mock).mockReturnValue({
        data: null,
        errors: { breakdown: "bad" },
      });
      await expect(setBudgetTool.execute(invalid, mockContext)).rejects.toThrow(
        "Invalid input",
      );
    });
  });
});
