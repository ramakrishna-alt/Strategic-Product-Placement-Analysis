import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google OAuth Provider with Google Drive Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');

// Keep auth states in memory
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Set up listeners for auth state changes
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If user is logged in but token is not in memory (e.g. page refresh),
        // we prompt sign in again to capture the token or request token refresh.
        if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in handler
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google Drive access token from authentication.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get current cached access token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Sign out handler
export const logoutDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Interface for Google Drive File item
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

// Fetch files from Google Drive (CSV, Txt, Google Sheets)
export const listDriveFiles = async (token: string): Promise<DriveFile[]> => {
  const q = encodeURIComponent(
    "mimeType = 'text/csv' or mimeType = 'text/plain' or mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.google-apps.document'"
  );
  const fields = 'files(id, name, mimeType, modifiedTime, size)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=50`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to fetch files from Google Drive.');
  }

  const data = await res.json();
  return data.files || [];
};

// Fetch Google Drive file content
// If Google Sheet, export as text/csv first
export const getDriveFileContent = async (token: string, fileId: string, mimeType: string): Promise<string> => {
  let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  
  if (mimeType === 'application/vnd.google-apps.spreadsheet') {
    // Google Sheets must be exported as CSV
    url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`;
  } else if (mimeType === 'application/vnd.google-apps.document') {
    // Google Docs must be exported as text/plain or HTML
    url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to download file content from Google Drive.');
  }

  return await res.text();
};

// Create a new file in Google Drive
// Supports automatic conversion of raw text/csv to Google Sheets or Google Docs if specified
export const createDriveFile = async (
  token: string,
  name: string,
  content: string,
  mimeType: string,
  convertToGoogleWorkspaceFormat: boolean = false
): Promise<DriveFile> => {
  const boundary = 'drive_upload_boundary_3.5_flash';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Determine metadata mimeType
  let fileMimeType = mimeType;
  if (convertToGoogleWorkspaceFormat) {
    if (mimeType === 'text/csv') {
      fileMimeType = 'application/vnd.google-apps.spreadsheet';
    } else if (mimeType === 'text/plain' || mimeType === 'text/html') {
      fileMimeType = 'application/vnd.google-apps.document';
    }
  }

  const metadata = {
    name: name,
    mimeType: fileMimeType,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + mimeType + '\r\n\r\n' +
    content +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to save file to Google Drive.');
  }

  return await res.json();
};

// Delete a Google Drive file (with explicit confirmation in UI)
export const deleteDriveFile = async (token: string, fileId: string): Promise<boolean> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to delete file from Google Drive.');
  }

  return true;
};
