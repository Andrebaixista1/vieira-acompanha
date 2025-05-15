// api/relatorio.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { sistema, data } = req.query;

  if (!sistema || !data) {
    res.status(400).json({ erro: "Parâmetros sistema e data são obrigatórios." });
    return;
  }

  try {
    // Chama a API externa HTTP real
    const apiUrl = `http://26.87.3.24:3100/api/relatorio?sistema=${encodeURIComponent(sistema)}&data=${encodeURIComponent(data)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).send(errorText);
      return;
    }

    // Repasse os dados do arquivo para o front
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=relatorio_${data}.xlsx`);
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ erro: "Erro interno no proxy: " + err.message });
  }
}
