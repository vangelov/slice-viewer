import { Config } from "config";
import { useEffect, useState } from "react";
import { Volume } from "types";
import { BlobReader, ZipReader } from "@zip.js/zip.js";

function loadVolumeData(
  url: string,
  onProgress: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.responseType = "blob";
    request.onprogress = (event) => onProgress(event.loaded / event.total);

    request.onerror = () => {
      reject(new Error("Could not load data"));
    };

    request.onload = () => {
      const { response } = request;

      if (response && Math.trunc(request.status / 100) === 2) {
        resolve(response);
        return;
      }

      reject(new Error("Could not load data"));
    };

    request.send();
  });
}

async function unzipVolumeData(blob: Blob) {
  const arrayBufferStream = new TransformStream();
  const arrayBufferPromise = new Response(
    arrayBufferStream.readable
  ).arrayBuffer();

  const zipFileReader = new BlobReader(blob);
  const zipReader = new ZipReader(zipFileReader);

  const entries = await zipReader.getEntries();
  const firstEntry = entries.shift();
  if (!firstEntry || !firstEntry.getData) throw new Error("Cannot unzip data");
  await firstEntry.getData(arrayBufferStream.writable);

  await zipReader.close();

  return arrayBufferPromise;
}

export function useVolume() {
  const [volume, setVolume] = useState<Volume>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setProgress(0);

      try {
        const blob = await loadVolumeData(
          "/slice-viewer/volume_data.zip",
          setProgress
        );
        const arrayBuffer = await unzipVolumeData(blob);

        setVolume({ ...Config.volume, data: new Uint16Array(arrayBuffer) });
      } catch (error) {
        setError(error instanceof Error ? error : new Error(error as string));
      } finally {
        setIsLoading(false);
      }
    }
    if (!volume) loadData();
  }, [volume]);

  return { volume, error, isLoading, progress };
}
