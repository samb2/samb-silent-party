import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';
import * as fs from 'fs';
import path from 'path';
import getMP3Duration from 'get-mp3-duration';
import NodeID3 from 'node-id3';
import ip from 'ip';

class MainController extends Controller {
    main(req: Request, res: Response, next: NextFunction) {
        try {
            res.render('index');
        } catch (e: any) {
            next(e);
        }
    }

    stream(req: Request, res: Response, next: NextFunction) {
        try {
            const musicName = req.params.music;
            const musicPath = path.join(process.cwd(), `public/musics/${musicName}`);

            // Get the file stats to determine the file size
            const stat = fs.statSync(musicPath);
            const fileSize = stat.size;

            // Parse the range header if present
            const range = req.headers.range;
            if (range) {
                const [start, end] = range.replace('bytes=', '').split('-');
                const startByte = parseInt(start, 10);
                const endByte = end ? parseInt(end, 10) : fileSize - 1;

                const chunkSize = endByte - startByte + 1;

                res.writeHead(206, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': chunkSize,
                    'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                });

                const stream = fs.createReadStream(musicPath, { start: startByte, end: endByte });
                stream.pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': fileSize,
                });

                const stream = fs.createReadStream(musicPath);
                stream.pipe(res);
            }
        } catch (e: any) {
            next(e);
        }
    }

    async admin2(req: Request, res: Response, next: NextFunction) {
        try {
            const ipAddress = await ip.address();
            const url = `http://${ipAddress}:${process.env.PORT}`;
            const qrCodeUrl = await this.generateQrCode(url);
            // Set Directory
            const directory = process.cwd() + '/public/musics/';
            const files = fs.readdirSync(directory);

            const musicsInfo: any = [];

            for (const file of files) {
                const filePath = `${directory}${file}`;
                const stats = fs.statSync(filePath);
                const buffer = fs.readFileSync(filePath);

                const tags = NodeID3.read(filePath);
                const image = tags.image;
                const artist = tags.artist;

                // ----------- Get Duration -----------
                const duration = getMP3Duration(buffer);
                const total_seconds = duration / 1000;
                const minutes = Math.floor(total_seconds / 60);
                const seconds = Math.floor(total_seconds % 60);
                const formateDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                // ------------------------------------

                //----------- Get File Size -----------
                const fileSizeInBytes = (stats.size / 1048576).toFixed(2);
                //----------- Get File Format -----------
                const fileFormat = file.split('.').pop();
                const fileName = file.split('.').shift();
                if (fileFormat !== 'DS_Store') {
                    musicsInfo.push({
                        name: fileName,
                        format: fileFormat,
                        size: fileSizeInBytes,
                        duration: formateDuration,
                        image,
                        artist,
                    });
                }
            }
            //console.log(musicsInfo);
            //console.log(qrCodeUrl);
            res.render('admin2', { musicsInfo, qrCodeUrl, url });
        } catch (e: any) {
            next(e);
        }
    }

    async admin(req: Request, res: Response, next: NextFunction) {
        try {
            const list = fs.readdirSync(process.cwd() + '/public/musics');
            res.render('admin', { list });
        } catch (e: any) {
            next(e);
        }
    }

    async manage(req: Request, res: Response, next: NextFunction) {
        try {
            // const list = fs.readdirSync(process.cwd() + '/public/musics');
            // res.render('admin', { list });
        } catch (e: any) {
            next(e);
        }
    }

    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            //res.send('File uploaded successfully!');
            res.redirect('/admin2');
            // const list = fs.readdirSync(process.cwd() + '/public/musics');
            // res.render('admin', { list });
        } catch (e: any) {
            next(e);
        }
    }
}

export default new MainController();
