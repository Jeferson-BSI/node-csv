import { Router, Request, Response } from 'express';
import { Readable } from 'stream';
import readline from 'readline';

import multer from 'multer';
import { client } from './database/client';

const multerConfig = multer();

const router = Router();

interface IProduct {
  code_bar: string;
  description: string;
  price: number;
  quantity: number;
}

router.post(
  '/products',
  multerConfig.single('file'),
  async (request: Request, response: Response) => {
    const { file } = request;
    const { buffer } = file;

    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const productsLine = readline.createInterface({
      input: readableFile,
    });

    const products: IProduct[] = [];

    for await (let line of productsLine) {
      const [code_bar, description, price, quantity] = line.split(',');
      products.push({
        code_bar,
        description,
        price: Number(price),
        quantity: Number(quantity),
      });
    }

    for await (let { code_bar, description, price, quantity } of products) {
      await client.products.create({
        data: {
          code_bar,
          description,
          price,
          quantity,
        },
      });
    }

    return response.json(products);
  },
);

export { router };
