import { LinkService } from "../services/link.service.js";

export const LinkController = {
  async create(req, res) {
    try {
      const { url, code } = req.body;
      const finalCode = await LinkService.createLink(url, code);

      res.status(201).json({
        code: finalCode,
        url,
        shortUrl: `${process.env.BASE_URL}/${finalCode}`,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    const links = await LinkService.getAllLinks();
    res.json(links);
  },

  async getOne(req, res) {
    try {
      const link = await LinkService.getOneLink(req.params.code);
      res.json(link);
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  },

  async remove(req, res) {
    await LinkService.deleteLink(req.params.code);
    res.sendStatus(204);
  },

  async redirect(req, res) {
    try {
      const url = await LinkService.redirect(req.params.code);
      res.redirect(url);
    } catch {
      res.status(404).send("Not found");
    }
  },
};
