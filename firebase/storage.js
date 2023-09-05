import { format } from 'date-fns';
import { deleteObject, getDownloadURL as getStorageDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

// Bucket URL from Storage in Firebase Console
const BUCKET_URL = "gs://angular-pawm-app.appspot.com";


/**
 * The function `uploadImage` uploads an image to a storage bucket and returns the URL of the uploaded
 * image.
 * @param image - The "image" parameter is the image file that you want to upload. It can be in any
 * format supported by Firebase Storage, such as JPEG, PNG, or GIF.
 * @param uid - The `uid` parameter is a unique identifier for the user. It is typically used to create
 * a unique folder or directory in the storage bucket to store the uploaded image.
 * @returns the URL of the uploaded image.
 */
export async function uploadImage(image, uid){
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const bucket = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;
    const storageRef = ref(storage, bucket);
    await uploadBytes(ref(storage, bucket), image);
    return bucket;
}


/**
 * The function `getDownloadURL` retrieves the download URL for a file in a specified storage bucket.
 * @param bucket - The `bucket` parameter is the name of the storage bucket from which you want to get
 * the download URL.
 * @returns a promise that resolves to the download URL of a file in a storage bucket.
 */
export async function getDownloadURL(bucket){
    return await getStorageDownloadURL(ref(storage,bucket));
}


/**
 * The function replaces an image in a specified bucket.
 * @param image - The `image` parameter is the image file that you want to replace. It can be a File
 * object or a Blob object representing the image file.
 * @param bucket - The `bucket` parameter is the name of the storage bucket where the image will be
 * uploaded.
 */
export function replaceImage(image, bucket) {
    uploadBytes(ref(storage, bucket), image);
  }


/**
 * The function `deleteImage` deletes an image object from a specified bucket.
 * @param bucket - The `bucket` parameter is the name of the storage bucket from which you want to
 * delete the image.
 */
export function deleteImage(bucket) {
    deleteObject(ref(storage, bucket));
  }