import path from 'path';
import crypto from 'crypto';

/**
 * It takes a URL, creates a hash of the URL, and returns a new filename based on the original filename and the hash.
 * So if a document include 2 images with the same name but from different urls, the files will not get overwritten
 * when downloaded to the same folder, each image gets a different suffix hash based on the full URL.
 * @param url - The URL of the file to be downloaded.
 * @returns A new filename with the hash of the url appended to the end of the filename.
 * @author github.com/victornpb
 *
 * @example
 * hashFilename('https://foo.com/site-logo.png') // 'site-logo_tWQ82rOT.png'
 * hashFilename('https://bar.com/site-logo.png') // 'site-logo_azOmiCST.png'
 */
export default function hashFilename(url) {
  const hash = crypto.createHash('sha1').update(url).digest('base64').replace(/[+/=]/g, '').substring(0, 8);
  const parsedFilenane = path.parse(path.basename(url));
  const newFilename = parsedFilenane.name + '_' + hash + parsedFilenane.ext;
  return newFilename;
}
