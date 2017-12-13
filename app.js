const aws = require('aws-sdk');
const crypto = require('crypto');

const kms = new aws.KMS({
    accessKeyId: 'AKIAJTRNOSMLTIA7ROQ',
    secretAccessKey: 'lJQtdIfH/Cup9AypaaHV8h2NnR/eKFIsZea2Vn0',
    region: 'ap-southeast-1'
});

function encrypt(buffer) {
    return new Promise((resolve, reject) => {
        const params = {
            KeyId: '965d2884-b2ab-4e78-8773-6b1f57133300', // The identifier of the CMK to use for encryption. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
            Plaintext: buffer// The data to encrypt.
        };
        kms.encrypt(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } else {
                console.log(data);
                resolve(data.CiphertextBlob);
            }
        });
    });
}

function decrypt(buffer) {
    return new Promise((resolve, reject) => {
        const params = {
            CiphertextBlob: buffer// The data to encrypt.
        };
        kms.decrypt(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } else {
                console.log(data);
                resolve(data.Plaintext);
            }
        });
    });
}

function generateDataKey() {
    return new Promise((resolve, reject) => {
        const params = {
            KeyId: '965d2884-b2ab-4e78-8773-6b1f57133300', // The identifier of the CMK to use to encrypt the data key. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
            KeySpec: 'AES_256'// Specifies the type of data key to return.
        };
        kms.generateDataKey(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    });
}

function encryptAES(key, strBuffer) {
    const algorithm = 'AES-256-CBC';

    const iv = new Buffer('00000000000000000000000000000000', 'hex');

    encryptor = crypto.createCipheriv(algorithm, key, iv);
    encryptor.write(strBuffer);
    encryptor.end();

    const cipher_text = encryptor.read();
    console.log(cipher_text);

    return cipher_text;
}

function decryptAES(key, buffer) {
    const algorithm = 'AES-256-CBC';

    const iv = new Buffer('00000000000000000000000000000000', 'hex');

    encryptor = crypto.createDecipheriv(algorithm, key, iv);
    encryptor.write(buffer);
    encryptor.end();

    const cipher_text = encryptor.read();
    console.log(cipher_text);

    return cipher_text;
}


generateDataKey().then(data => decrypt(data.CiphertextBlob)).then(data => {
    const buffer = decryptAES(data.Plaintext, encryptAES(data.Plaintext, new Buffer('abc','utf-8')));
    console.log(buffer.toString('utf-8'));
});


encrypt(new Buffer('abc','utf-8')).then(decrypt).then(plaintext => {
    console.log(plaintext.toString('utf-8'));
});