import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs'; // fs: file system

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Welcome to Express API');
});

app.get('/products', (req: Request, res: Response) => {
  const readData = fs.readFileSync('./src/db/db.json', 'utf-8');
  const readDataJSON = JSON.parse(readData);

  res.status(200).json({
    success: true,
    message: 'Get Products Success',
    data: readDataJSON.products,
  });
});

app.post('/products', (req: Request, res: Response) => {
  // 3 Method
  // - Body       : Data yg Submit
  // - Url        : Id atau Query Search
  // - Headers    : Token Auth
  const { name, price, unit, category } = req.body;

  const readData = fs.readFileSync('./src/db/db.json', 'utf-8');
  const readDataJSON = JSON.parse(readData);
  readDataJSON.products.push({
    id: readDataJSON.products[readDataJSON.products.length - 1].id + 1,
    name,
    price,
    unit,
    category,
  });

  fs.writeFileSync('./src/db/db.json', JSON.stringify(readDataJSON));

  res.status(201).json({
    success: true,
    message: 'Post Product Success',
    data: { name, price, unit, category },
  });
});

app.put('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, unit, category } = req.body;

    const readData = fs.readFileSync('./src/db/db.json', 'utf-8');
    const readDataJSON = JSON.parse(readData);

    const findIndex = readDataJSON.products.findIndex(
      (item: any) => item.id === Number(id)
    );

    if (findIndex === -1) throw new Error(`Product with Id ${id} Not Found`);

    readDataJSON.products[findIndex] = {
      ...readDataJSON.products[findIndex],
      name,
      price,
      unit,
      category,
    };

    fs.writeFileSync('./src/db/db.json', JSON.stringify(readDataJSON));

    res.status(200).json({
      success: true,
      message: `Update Product with Id ${id} Success`,
      data: { name, price, unit, category },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const readData = fs.readFileSync('./src/db/db.json', 'utf-8');
    const readDataJSON = JSON.parse(readData);

    const findIndex = readDataJSON.products.findIndex(
      (item: any) => item.id == Number(id)
    );

    if (findIndex === -1) throw new Error(`Product with Id ${id} Not Found`);

    readDataJSON.products.splice(findIndex, 1);

    fs.writeFileSync('./src/db/db.json', JSON.stringify(readDataJSON));

    res.status(200).json({
      success: true,
      message: `Delete Product with Id ${id} Success`,
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

// Postman: http://localhost:5000/products/1

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// PUT: Mengirimkan Semua Data
// PATCH: Mengirimkan Data yang Akan di Update Saja
