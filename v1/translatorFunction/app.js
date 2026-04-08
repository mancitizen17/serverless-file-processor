'use strict'

console.log("Lambda function initialized");

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION
const s3 = new AWS.S3()

const { translateText } = require('./translate')

// Supported language codes
const supportedLanguages = ['ar','zh','zh-TW','cs','da','nl','en','fi','fr','de','he','hi','id','it','ja','ko','ms','no','fa','pl','pt','ru','es','sv','tr']
const targetLanguages = process.env.targetLanguage.split(' ')

// Lambda handler
exports.handler = async (event) => {
  console.log("Lambda triggered");
  console.log("Incoming event:", JSON.stringify(event, null, 2));

  // Validate event
  if (!event || !event.Records || event.Records.length === 0) {
    console.error("Invalid event structure");
    return;
  }

  const fileKey = event.Records[0].s3.object.key;

  // Process only .txt files
  if (!fileKey.endsWith(".txt")) {
    console.log("Skipping non-text file");
    return;
  }

  // Skip already translated files
  if (fileKey.includes('translations')) {
    console.log("Skipping already translated files");
    return;
  }

  // Validate target languages
  if (!arrayContainsArray(supportedLanguages, targetLanguages)) {
    console.error(`Aborting: targetLanguages includes unsupported language codes`);
    return;
  }

  // Process translations in parallel
  await Promise.all(
    targetLanguages.map(async (targetLanguage) => {
      try {
        console.log(`Starting translation for: ${targetLanguage}`);
        await doTranslation(event, targetLanguage);
        console.log(`Completed translation for: ${targetLanguage}`);
      } catch (err) {
        console.error(`Handler error: ${err}`);
      }
    })
  )
}

// Translation function
const doTranslation = async (event, targetLanguage) => {
  return new Promise(async (resolve, reject) => {
    const bucketName = event.Records[0].s3.bucket.name;
    const fileKey = event.Records[0].s3.object.key;

    console.log(`Fetching file from bucket: ${bucketName}`);

    try {
      // Fetch file
      const originalText = await s3.getObject({
        Bucket: bucketName,
        Key: fileKey
      }).promise()

      if (!originalText || !originalText.Body) {
        console.error("Empty file received");
        return reject("Empty file");
      }

      // Translate
      const data = await translateText(
        originalText.Body.toString('utf-8'),
        targetLanguage
      )

      // Save output
      const baseObjectName = fileKey.replace('.txt', '')

      await s3.putObject({
        Bucket: bucketName,
        Key: `translations/${baseObjectName}-${targetLanguage}.txt`,
        Body: data.TranslatedText,
        ContentType: 'text/plain'
      }).promise()

      console.log(`Saved translated file: ${baseObjectName}-${targetLanguage}.txt`);
      resolve()

    } catch (err) {
      console.error(`Translation error: ${err}`);
      return reject(err);
    }
  })
}

// Utility function
function arrayContainsArray (superset, subset) {
  return subset.every(value => superset.includes(value))
}