import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const upload = multer({ storage: multer.memoryStorage() });

  // Extract Text from PDF/TXT Endpoint
  app.post("/api/extract-text", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "未上传文件" });
      }

      let text = "";
      if (req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf")) {
        const { createRequire } = await import("module");
        const require = createRequire(import.meta.url);
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } else {
        text = req.file.buffer.toString("utf-8");
      }

      res.json({ text });
    } catch (error: any) {
      console.error("Error extracting text:", error);
      res.status(500).json({ error: "提取文本失败: " + error.message });
    }
  });

  // AI Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { mistakes, exams = [] } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let examsContext = "";
      if (exams && exams.length > 0) {
        examsContext = `\n\n【学生提供的真题原文参考】：\n`;
        exams.forEach((exam: any) => {
          // Limit exam text to avoid extreme token usage if too large, though Gemini handles large contexts well
          examsContext += `\n--- ${exam.year}年真题原文 ---\n${exam.content}\n`;
        });
      }

      const prompt = `你是一位专业的考研英语名师。学生提交了他的错题复盘记录，请根据这些记录，帮他进行深度整合分析，找出他的核心薄弱点，并给出具体的改进方法。${examsContext ? "结合提供的真题原文，进行更精准地定位和解析！" : ""}

学生提交的错题记录如下（JSON格式）：
${JSON.stringify(mistakes, null, 2)}
${examsContext}
请你的分析包含以下几个部分：
1. **错题数据总览**：简单总结他一共提交了多少题，集中在哪些题型。
2. **核心薄弱点诊断**：不要停留在表面（比如“词汇量不够”），要结合他提交的“我的复盘思路 (myThoughtProcess)”和“总结的盲区 (coreWeakness)”，一针见血地指出他在逻辑、长难句、或者特定题型（如主旨题、词义题）上的致命误区。
3. **定制化提分策略**：针对找出的薄弱点，给出3-4条非常具体、可落地的改进建议（比如：下次遇到暧昧选项该怎么做对位法，平时复习如何积累）。
4. **鼓励与打气**：用名师的口吻给他一些鼓励。

请使用 Markdown 格式排版，让内容清晰易读。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({ error: "Failed to generate analysis" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
