import CryptoJS from "crypto-js";
import crypto from "crypto";
import sjcl from "sjcl";
import aesjs from "aes-js";
import { PerformanceObserver, performance } from 'perf_hooks';

const random10k = crypto.randomBytes(10000).toString('hex');
const random100k = crypto.randomBytes(100000).toString('hex');
const random500k = crypto.randomBytes(500000).toString('hex');

const passSample = 'VOZlEsc7dzJjp7S3HFZi4IfgNzpPuVDo';

const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      console.log(entry)
    });
});
  
perfObserver.observe({ entryTypes: ["measure"], buffer: true });
/**
 * SJCL Test Run
 */
const runSJCL = () => {
    performance.mark('sjcl-enc-start');
    var encryptedsjcl = sjcl.encrypt(passSample, random10k)
    performance.mark('sjcl-enc-end');
    
    performance.measure('sjcl-enc', 'sjcl-enc-start', 'sjcl-enc-end');
    
    performance.mark('sjcl-dec-start');
    var decrytedsjcl = sjcl.decrypt(passSample, encryptedsjcl)
    performance.mark('sjcl-dec-end');
    
    performance.measure('sjcl-dec', 'sjcl-dec-start', 'sjcl-dec-end');
}
/**
 * CryptoJS Test Run
 */
const runCryptoJs = () => {
    performance.mark('crypto-js-enc-start');
    var encryptedCryptoJS = CryptoJS.AES.encrypt(random10k, passSample);
    performance.mark('crypto-js-enc-end');
    
    performance.measure('crypto-js-enc', 'crypto-js-enc-start', 'crypto-js-enc-end');
    
    performance.mark('crypto-js-dec-start');
    var decryptedCryptoJS = CryptoJS.AES.decrypt(encryptedCryptoJS, passSample);
    performance.mark('crypto-js-dec-end');
    
    performance.measure('crypto-js-dec', 'crypto-js-dec-start', 'crypto-js-dec-end');
}
/**
 * Native Node.js Test Run
 */
const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    performance.mark('crypto-enc-start');
    const cipher = crypto.createCipheriv(algorithm, passSample, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    performance.mark('crypto-enc-end')
    performance.measure('crypto-enc', 'crypto-enc-start', 'crypto-enc-end');

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    performance.mark('crypto-dec-start');
    const decipher = crypto.createDecipheriv(algorithm, passSample, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    performance.mark('crypto-dec-end')
    performance.measure('crypto-dec', 'crypto-dec-start', 'crypto-dec-end');

    return decrpyted.toString();
};

const runCrypto = () => {
    var encryptedCrypto = encrypt(random10k);
    var decryptedCrypto = decrypt(encryptedCrypto);
}

/**
 * aes-js test run
 */
const runAesJs = () => {
    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    performance.mark('aes-js-enc-start');
    var textBytes = aesjs.utils.utf8.toBytes(random10k);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    performance.mark('aes-js-enc-end')
    performance.measure('aes-js-enc', 'aes-js-enc-start', 'aes-js-enc-end');

    performance.mark('aes-js-dec-start');
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    performance.mark('aes-js-dec-end')
    performance.measure('aes-js-enc', 'aes-js-dec-start', 'aes-js-dec-end');
}

/**
 * Driver
 */
runCryptoJs();
runSJCL();
runCrypto();
runAesJs();

