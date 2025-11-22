import { LinkModel } from "../models/link.model.js";

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 10).slice(0, 6);
}

export const LinkService = {
  async createLink(url, code) {
    // validate URL
    try {
      new URL(url);
    } catch {
      throw new Error("Invalid URL");
    }

    // custom code validation
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      throw new Error("Code must be 6–8 alphanumeric");
    }

    // if code already exists
    if (code) {
      const exists = await LinkModel.findByCode(code);
      if (exists) throw new Error("Code already exists");
    }

    // auto-generate if not provided
    if (!code) {
      let unique = false;
      while (!unique) {
        const temp = generateRandomCode();
        const exists = await LinkModel.findByCode(temp);
        if (!exists) {
          code = temp;
          unique = true;
        }
      }
    }

    await LinkModel.create(code, url);

    return code;
  },

  async getAllLinks() {
    return await LinkModel.findAll();
  },

  async getOneLink(code) {
    const link = await LinkModel.findByCode(code);
    if (!link) throw new Error("Not found");
    return link;
  },

  async deleteLink(code) {
    await LinkModel.delete(code);
  },

  async redirect(code) {
    const link = await LinkModel.findByCode(code);
    if (!link) throw new Error("Not found");

    await LinkModel.incrementClicks(code);

    return link.target_url;
  },
};
