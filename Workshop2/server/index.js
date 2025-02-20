const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: '*',
}));

app.get('/tipocambio', function (req, res) {
  const type = req.query.type;

  const rates = {
    usd: {
      TipoCompra: "608",
      TipoVenta: "621",
    },
    eur: {
      TipoCompra: "731.85",
      TipoVenta: "761.9",
    }
  };

  res.json(rates[type] || { error: "Tipo no válido" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
