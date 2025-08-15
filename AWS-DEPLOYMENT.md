# AWS Deployment Guide for Angular Expert Test

## Option 1: AWS S3 + CloudFront (Recommended)

### Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions

### Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-unique-bucket-name
   ```

2. **Configure S3 for Static Website Hosting**
   ```bash
   aws s3 website s3://your-unique-bucket-name --index-document index.html --error-document index.html
   ```

3. **Apply Bucket Policy**
   - Edit `aws-s3-policy.json` and replace `your-bucket-name` with your actual bucket name
   ```bash
   aws s3api put-bucket-policy --bucket your-unique-bucket-name --policy file://aws-s3-policy.json
   ```

4. **Deploy Application**
   - Edit `deploy.bat` and replace placeholders with your actual values
   - Run the deployment script:
   ```bash
   deploy.bat
   ```

5. **Optional: Set up CloudFront**
   - Create CloudFront distribution pointing to your S3 bucket
   - Update `deploy.bat` with your distribution ID

### Manual Deployment
```bash
npm run build
aws s3 sync dist/angular-expert-test/ s3://your-bucket-name --delete
```

## Option 2: AWS Amplify (Easiest)

### Steps

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your GitHub repository

2. **Configure Build**
   - Amplify will auto-detect Angular
   - Use the provided `amplify.yml` for custom build settings

3. **Deploy**
   - Amplify will automatically deploy on every push to main branch

### Build Configuration
The `amplify.yml` file is already configured for your Angular project.

## URLs After Deployment

- **S3 Website Endpoint**: `http://your-bucket-name.s3-website-region.amazonaws.com`
- **CloudFront**: Your custom CloudFront domain
- **Amplify**: Provided by AWS Amplify (e.g., `https://main.d1234567890.amplifyapp.com`)

## Cost Estimates

- **S3 + CloudFront**: ~$1-5/month for typical traffic
- **Amplify**: ~$1-10/month depending on usage

## Files Created
- `aws-s3-policy.json`: S3 bucket policy for public access
- `deploy.bat`: Deployment script for S3
- `amplify.yml`: AWS Amplify build configuration