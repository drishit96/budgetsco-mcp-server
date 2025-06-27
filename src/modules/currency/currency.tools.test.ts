import type { Mock } from "vitest";

import { beforeEach, describe, expect, it, vi } from "vitest";

import * as apiUtils from "../../utils/api.utils.js";
import { mockContext } from "../../utils/mock.utils.js";
import * as schema from "./currency.schema.js";
import { getCurrencyTool, setCurrencyTool } from "./currency.tools.js";

vi.mock("../../utils/api.utils.js");
vi.mock("./currency.schema.js");

describe("currency.tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrencyTool", () => {
    it("should call /currency/get and return data", async () => {
      const mockData = { currency: "USD" };
      (apiUtils.callApi as Mock).mockResolvedValue({
        data: mockData,
      });
      const result = await getCurrencyTool.execute(undefined, mockContext);
      expect(apiUtils.callApi).toHaveBeenCalledWith({ path: "/currency/get" });
      expect(result).toBe(JSON.stringify(mockData));
    });
  });

  describe("setCurrencyTool", () => {
    it("should call /currency/set with valid input and return data", async () => {
      const mockArgs = { currency: "EUR" };
      const mockParsed = { data: { currency: "EUR" }, errors: null };
      const mockResponse = { data: { success: true } };
      (schema.parseCurrencyPreferenceInput as Mock).mockReturnValue(mockParsed);
      (apiUtils.callApi as Mock).mockResolvedValue(mockResponse);
      const result = await setCurrencyTool.execute(mockArgs, mockContext);
      expect(schema.parseCurrencyPreferenceInput).toHaveBeenCalledWith(
        mockArgs,
      );
      expect(apiUtils.callApi).toHaveBeenCalledWith({
        body: mockParsed.data,
        method: "POST",
        path: "/currency/set",
      });
      expect(result).toBe(JSON.stringify(mockResponse.data));
    });

    it("should throw error if input is invalid", async () => {
      const mockArgs = { currency: "INVALID" };
      const mockParsed = {
        data: null,
        errors: { currency: "Invalid currency" },
      };
      (schema.parseCurrencyPreferenceInput as Mock).mockReturnValue(mockParsed);
      await expect(
        setCurrencyTool.execute(mockArgs, mockContext),
      ).rejects.toThrow("Invalid input");
    });
  });
});
