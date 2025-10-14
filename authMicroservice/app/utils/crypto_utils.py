from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
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


def decrypt_acm_value(token: str):
    """Decrypt value encrypted with CryptoJS AES-CBC (Base64(iv + ciphertext))."""
    key = get_key()
    data = base64.b64decode(token)

    # Split IV and ciphertext
    iv, ciphertext = data[:16], data[16:]

    # Initialize AES-CBC cipher
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv),
                    backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()

    # Remove PKCS7 padding
    unpadder = padding.PKCS7(128).unpadder()
    decrypted = unpadder.update(decrypted_padded) + unpadder.finalize()

    return decrypted.decode("utf-8")
