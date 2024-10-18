import crypto from "crypto";
import fs from "fs";
import path from "path";

// File path to store the code verifier
const codeVerifierFilePath = path.join(__dirname, "./code_verifier.json");

// Step 1: Generate Code Verifier for PKCE
export const generateCodeVerifier = () => {
  const codeVerifier = crypto
    .randomBytes(32)
    .toString("base64url")
    .slice(0, 43);

  // Save the code verifier to a file for later use
  saveCodeVerifierToFile(codeVerifier);

  return codeVerifier;
};

// Step 2: Generate Code Challenge for PKCE using the code verifier
export const generateCodeChallenge = (codeVerifier: string) => {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
};

// Save the code verifier to a JSON file
const saveCodeVerifierToFile = (codeVerifier: string) => {
  const codeVerifierData = {
    code_verifier: codeVerifier,
    created_at: new Date().toISOString(), // Timestamp for reference
  };

  fs.writeFileSync(
    codeVerifierFilePath,
    JSON.stringify(codeVerifierData, null, 2), // Pretty print JSON
    "utf8"
  );
};

// Read the code verifier from the file when needed
export const readCodeVerifierFromFile = () => {
  if (fs.existsSync(codeVerifierFilePath)) {
    const codeVerifierData = fs.readFileSync(codeVerifierFilePath, "utf8");
    return JSON.parse(codeVerifierData).code_verifier;
  }
  return null; // Return null if the file does not exist
};
