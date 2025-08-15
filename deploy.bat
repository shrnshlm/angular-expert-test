@echo off
echo Building Angular application...
call npm run build

echo Uploading to S3...
aws s3 sync dist/angular-expert-test/ s3://your-bucket-name --delete

echo Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo Deployment complete!
pause