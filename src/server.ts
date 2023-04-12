import * as http from 'http';

import debug0 from 'debug';

import { logger } from './config/logger';
import { App } from './app';

import { Server as SocketServer } from 'socket.io';

export class Server {
    port: number = Config.server.port;
    server: any;
    debug = debug0('iRole-Express-Api:server');

    constructor() {
        this.setServer();
    }

    setServer() {
        /**
         * Create HTTP server.
         */
        this.server = http.createServer(new App().app);

        this.server.on('error', this.onError);

        const io = new SocketServer(this.server);

        let currentTime = 0;
        let src;

        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('select', (data) => {
                currentTime = 0;
                io.emit('playSelectedSong', data);
            });

            socket.on('pause', function () {
                io.emit('pauseCurrentSong');
            });

            socket.on('paused', function (data) {
                currentTime = data.currentTime;
                src = data.src;
            });

            socket.on('play', () => {
                io.emit('playCurrentSong', { currentTime, src });
            });

            socket.on('disconnect', () => {
                //console.log('user disconnected');
            });
        });
        this.server.listen(this.port, '0.0.0.0', () => {
            logger.info(`Server listening on port: ${this.port} Mode = ${Config.server.environment}`);
        });
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    onError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = `Port ${this.port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                logger.error(`${bind} requires elevated privileges`, error);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(`${bind} is already in use`, error);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}
