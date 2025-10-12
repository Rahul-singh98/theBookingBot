from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os
import base64


def get_key():
    key = os.environ.get("CHATBOT_CRYPTO_KEY", None)
    if key:
        return base64.b64decode(key)
    key = AESGCM.generate_key(bit_length=128)
    return key


def encrypt_value(plaintext: str):
    key = get_key()
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)
    return base64.b64encode(nonce + ciphertext).decode()


def decrypt_value(token: str):
    key = get_key()
    data = base64.b64decode(token)
    nonce, ciphertext = data[:12], data[12:]
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, None).decode()
