import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { readDataJSON } from './utils/read.data.json';
import { writeDataJSON } from './utils/write.data.json';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Welcome to Express API');
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const data = readDataJSON();

    const findExistingUser = data.users.filter(
      (user: any) => user.email === email || user.username === username
    );

    if (findExistingUser.length)
      throw new Error('Email or Username Already Registered');

    data.users.push({
      uid: Date.now(),
      username,
      email,
      password,
      role: 'USER',
    });

    writeDataJSON(data);

    res.status(201).json({
      success: true,
      message: 'Register Success',
      data: { username, email, password },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const data = readDataJSON();

    const findUserByUsernameAndPassword = data.users.filter(
      (user: any) => user.username === username && user.password === password
    );

    if (!findUserByUsernameAndPassword.length)
      throw new Error('Username and Password Doesnt Match');

    res.status(200).json({
      success: true,
      message: 'Login Success',
      data: {
        uid: findUserByUsernameAndPassword[0].uid,
        username: findUserByUsernameAndPassword[0].username,
        role: findUserByUsernameAndPassword[0].role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.get('/api/movies', (req: Request, res: Response) => {
  try {
    const { time, date, status } = req.query;

    const data = readDataJSON();

    const now = new Date().toISOString().split('T')[0];

    const modifiedStatus = data.movies.map((movie: any) => {
      if (now < movie.start_showing) {
        return { ...movie, status: 'UPCOMING' };
      } else if (now > movie.start_showing && now < movie.end_showing) {
        return { ...movie, status: 'ON_SHOWING' };
      } else {
        return { ...movie, status: 'ENDED' };
      }
    });
    let filteringMovie;
    if (status && time && date) {
      filteringMovie = modifiedStatus.filter(
        (movie: any) =>
          movie.times.includes(time) &&
          (date! > movie.start_showing && date! < movie.end_showing) &&
          movie.status === status
      );
    } else if (status && time) {
      filteringMovie = modifiedStatus.filter(
        (movie: any) => movie.times.includes(time) && movie.status === status
      );
    } else if (status && date) {
      filteringMovie = modifiedStatus.filter(
        (movie: any) =>
          (date! > movie.start_showing && date! < movie.end_showing) &&
          movie.status === status
      );
    } else if (time && date) {
      filteringMovie = modifiedStatus.filter(
        (movie: any) =>
          movie.times.includes(time) &&
          (date! > movie.start_showing && date! < movie.end_showing)
      );
    }

    if (status || time || date) {
      res.status(200).json({
        success: true,
        message: 'Get Films Success',
        data: filteringMovie,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Get Films Success',
        data: modifiedStatus,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
