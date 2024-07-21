const AWS = require("aws-sdk");
require("dotenv").config();

const uploadToS3 = async (data, filename) => {
  const BUCKET_NAME = "expensetracker2409";
  const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
  const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

  const S3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    S3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        console.log("Error in s3bucket upload");
        reject(err);
      } else {
        resolve(s3Response.Location);
      }
    });
  });
};

module.exports = { uploadToS3 };
