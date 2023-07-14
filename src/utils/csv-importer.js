import { parse } from 'csv-parse'
import fs from 'node:fs/promises'
import http from 'node:http'

async function importCSV() {
  const filePath = 'src/arquivo.csv';
  //const filePath = new URL('arquivo.csv', import.meta.url);
  const csvData = await fs.readFile(filePath, 'utf-8');

  parse(csvData, {
    columns: true, // Define a primeira linha do CSV como cabeçalho
    skip_empty_lines: true
  })
    .on('readable', function () {
      let record;
      while ((record = this.read())) {
        const { id, title, description, completed_at, created_at, update_at } = record;
        const task = { id, title, description, completed_at, created_at, update_at };

        // Converte o objeto task em JSON
        const jsonData = JSON.stringify(task);

        const options = {
          method: 'POST',
          hostname: 'localhost',
          port: 3333,
          path: '/tasks',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonData)
          }
        };

        const req = http.request(options, (res) => {
          let responseData = '';

          res.on('data', (chunk) => {
            responseData += chunk;
          });

          res.on('end', () => {
            console.log('Tarefa importada:', responseData);
          });
        });

        req.on('error', (error) => {
          console.error('Erro ao importar tarefa:', error.message);
        });

        // Envia os dados da tarefa no corpo da requisição
        req.write(jsonData);
        req.end();
      }
    })
    .on('error', function (error) {
      console.error('Erro ao ler o arquivo CSV:', error.message);
    });
}

importCSV();

