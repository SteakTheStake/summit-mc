import { FieldHook } from "payload/types";

const formatPageSlug = (val: string): string =>
  val
    .replace(/ /g, "-")
    .replace(/[^\w-/]+/g, "")
    .toLowerCase();

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === "string") {
      return formatPageSlug(value);
    }
    const fallbackData =
      (data && data[fallback]) || (originalDoc && originalDoc[fallback]);

    if (fallbackData && typeof fallbackData === "string") {
      return formatPageSlug(fallbackData);
    }

    return value;
  };

function generate() {
  let code = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export const generateCode =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    const smcRegex = /^smc-[a-zA-Z0-9]{6}$/;
    if (value && smcRegex.test(value)) {
      return value;
    }

    return `smc-${generate()}`;
  };
