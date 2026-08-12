import { JSEncrypt } from "jsencrypt";
import ApiService from "./api";

class EncryptionService {
  private publicKey: string | null = null;
  public requestId: string | null = null;
  private fetchPromise: Promise<boolean> | null = null;

  async fetchPublicKey(): Promise<boolean> {
    if (this.publicKey) return true;
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = ApiService.get<{
      key?: string;
      value?: { key: string; requestId: string };
      requestId?: string;
    }>("crypto/generate-key", true)
      .then((response) => {
        if (response && !response.error && response.data) {
          const key = response.data.value?.key || response.data.key;
          const reqId =
            response.data.value?.requestId || response.data.requestId;

          if (key) {
            this.publicKey = key;
            this.requestId = reqId || null;
            return true;
          }
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        this.fetchPromise = null;
      });

    return this.fetchPromise;
  }

  encrypt(textToEncrypt: string): string | null {
    if (!this.publicKey) return null;

    try {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(this.publicKey);
      const encrypted = encryptor.encrypt(textToEncrypt);
      return encrypted ? encrypted.toString() : null;
    } catch {
      return null;
    }
  }
}

const service = new EncryptionService();
export default service;
