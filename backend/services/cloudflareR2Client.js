const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

class CloudflareR2Service {
  constructor() {
    this.accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    this.accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'talentechno-media';
    this.publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '';

    this.isR2Configured = Boolean(
      this.accountId && 
      this.accessKeyId && 
      this.secretAccessKey && 
      this.bucketName
    );

    this.localUploadDir = path.join(__dirname, '..', '..', 'assets', 'uploads');
    this.ensureLocalDir();

    if (this.isR2Configured) {
      console.log('⚡ [R2] Initializing Cloudflare R2 S3 Client for bucket:', this.bucketName);
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey
        }
      });
    } else {
      console.log('ℹ️  [R2] Cloudflare R2 credentials not set. Running on local media storage (assets/uploads)');
    }
  }

  ensureLocalDir() {
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

  // --- LIST IMAGES (Public Media Showcase) ---
  async listImages() {
    if (this.isR2Configured) {
      try {
        const command = new ListObjectsV2Command({
          Bucket: this.bucketName,
          MaxKeys: 100
        });

        const response = await this.s3Client.send(command);
        const files = (response.Contents || []).map(obj => {
          const publicUrl = this.publicDomain 
            ? `${this.publicDomain.replace(/\/$/, '')}/${obj.Key}`
            : `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com/${obj.Key}`;

          return {
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified,
            url: publicUrl,
            storage: 'Cloudflare R2'
          };
        });

        return { files, storage: 'Cloudflare R2' };
      } catch (err) {
        console.error('[R2] List error, falling back to local:', err.message);
      }
    }

    // Read local files
    this.ensureLocalDir();
    const localFiles = fs.readdirSync(this.localUploadDir);
    const files = localFiles.map(filename => {
      const filePath = path.join(this.localUploadDir, filename);
      const stat = fs.statSync(filePath);
      return {
        key: filename,
        size: stat.size,
        lastModified: stat.mtime,
        url: `/assets/uploads/${filename}`,
        storage: 'Local Storage'
      };
    });

    return { files, storage: 'Local Storage' };
  }
}

module.exports = new CloudflareR2Service();
