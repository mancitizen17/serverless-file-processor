'use strict'

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const translate = new AWS.Translate()

console.log("Translate module initialized");

// Max characters allowed in one request
const MAX_LENGTH = 5000   

const translateText = async (originalText, targetLanguageCode) => {
  return new Promise((resolve, reject) => {

    const params = {
      Text: originalText.substring(0, MAX_LENGTH),
      SourceLanguageCode: "auto",
      TargetLanguageCode: targetLanguageCode
    }

    try {
      translate.translateText(params, (err, data) => {
        if (err) {
          console.error(`Translation error: ${err}`);
          return reject(err);
        }

        console.log(`Translation successful for language: ${targetLanguageCode}`);
        resolve(data);
      })
    } catch (err) {
      console.error(`Unexpected error: ${err}`);
      return reject(err);
    }
  })
}

module.exports = { translateText }