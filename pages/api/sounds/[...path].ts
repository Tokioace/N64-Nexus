import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: soundPath } = req.query;
  
  if (!soundPath || Array.isArray(soundPath)) {
    return res.status(400).json({ error: 'Invalid sound path' });
  }

  try {
    const soundFilePath = path.join(process.cwd(), 'public', 'sounds', soundPath);
    const soundBuffer = await fs.readFile(soundFilePath);
    
    // Set appropriate headers for audio files
    const ext = path.extname(soundPath).toLowerCase();
    let contentType = 'audio/mpeg';
    
    switch (ext) {
      case '.mp3':
        contentType = 'audio/mpeg';
        break;
      case '.wav':
        contentType = 'audio/wav';
        break;
      case '.ogg':
        contentType = 'audio/ogg';
        break;
      default:
        contentType = 'audio/mpeg';
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(soundBuffer);
  } catch (error) {
    console.error('Error serving sound file:', error);
    res.status(404).json({ error: 'Sound file not found' });
  }
}