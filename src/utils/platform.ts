import * as os from 'os';
import * as path from 'path';

export interface PlatformInfo {
  platform: 'linux' | 'darwin';
  arch: 'x64' | 'arm64';
  libraryPath: string;
}

export class PlatformDetector {
  static detectPlatform(): PlatformInfo {
    const platform = os.platform();
    const arch = os.arch();
    
    let binaryName: string;
    if (platform === 'darwin' && arch === 'arm64') {
      binaryName = 'signer-arm64.dylib';
    } else if (platform === 'linux' && arch === 'x64') {
      binaryName = 'signer-amd64.so';
    } else {
      throw new Error(`Unsupported platform: ${platform}/${arch}`);
    }

    const libraryPath = path.join(__dirname, '..', '..', 'signers', binaryName);
    
    return {
      platform: platform as 'linux' | 'darwin',
      arch: arch as 'x64' | 'arm64',
      libraryPath
    };
  }

  static validateBinaryExists(): boolean {
    const fs = require('fs');
    const info = this.detectPlatform();
    
    try {
      return fs.existsSync(info.libraryPath);
    } catch (error) {
      console.error(`Error checking binary existence: ${error}`);
      return false;
    }
  }
}
