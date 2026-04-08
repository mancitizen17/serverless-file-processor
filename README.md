# Serverless File Translation System

## Overview :
Developed a serverless application that automatically processes and translates text files using AWS S3 and AWS Lambda. The system triggers a Lambda function whenever a file is uploaded, processes the content, and stores translated outputs.

## Architecture : 
S3 Bucket → Lambda Trigger → Text Processing → AWS Translate → Output Storage

## Features :
- Event-driven architecture using AWS S3 and Lambda  
- Automatic translation of uploaded text files  
- Support for multiple target languages  
- File validation to process only `.txt` files  
- Structured logging and error handling for reliability  

## Tech Stack :
- AWS S3  
- AWS Lambda  
- AWS Translate  
- Node.js  

## Key Improvements :
- Added input validation to prevent invalid file processing  
- Implemented structured logging for better debugging  
- Enhanced error handling for robustness  

## How It Works :
1. Upload a `.txt` file to the S3 bucket  
2. Lambda function is triggered automatically  
3. File content is translated into multiple languages  
4. Translated files are stored in the `translations/` folder  

## Learning Outcomes :
- Built and understood event-driven cloud architecture  
- Gained hands-on experience with serverless computing  
- Worked with AWS services for real-time data processing  
