import autoBind from 'auto-bind';
import qr from 'qrcode';

export default class Controller {
    constructor() {
        autoBind(this);
    }

    async generateQrCode(value: string) {
        return qr.toDataURL(value);
    }
}
