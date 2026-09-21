const imagesStore = "images";

type ImageRecord = {
  id: string;
  blob: Blob;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("imageDB", 1);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const target = e.target as IDBOpenDBRequest;
      const db = target.result;

      if (!db.objectStoreNames.contains(imagesStore)) {
        db.createObjectStore(imagesStore, { keyPath: "id" });
      }
    };

    request.onsuccess = (e) => {
      const target = e.target as IDBOpenDBRequest;
      resolve(target.result);
    };

    request.onerror = (e) => reject(e.target);
  });
}

export async function saveImage(id: string, blob: Blob): Promise<void> {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(imagesStore, "readwrite");
    const store = tx.objectStore(imagesStore);
    const record: ImageRecord = { id, blob };
    store.put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => {
      const target = e.target as IDBRequest;
      reject(target.error);
    };
  });
}

export async function getImage(id: string): Promise<Blob | null> {
  const db = await openDB();

  return new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(imagesStore, "readonly");
    const store = tx.objectStore(imagesStore);
    const request: IDBRequest<ImageRecord | undefined> = store.get(id);

    request.onsuccess = () => {
      resolve(request.result ? request.result.blob : null);
    };

    request.onerror = (e) => {
      const target = e.target as IDBRequest;
      reject(target.error);
    };
  });
}

export async function removeImage(id: string): Promise<void> {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(imagesStore, "readwrite");
    const store = tx.objectStore(imagesStore);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (e) => {
      const target = e.target as IDBRequest;
      reject(target.error);
    };
  });
}
