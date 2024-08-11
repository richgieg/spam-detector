# Spam Detector

This is the application I built as part of my capstone project for my Bachelor
of Science in Computer Science degree at Western Governors University. It's an
implementation of a Naive Bayes classifier, a machine learning algorithm. Naive
Bayes classifiers are based on Bayes' theorem, with the assumption of
independence between features. Despite their simplicity, they are widely used
for various classification tasks such as spam detection, sentiment analysis, and
document categorization due to their efficiency and effectiveness.

The application is meant to be used by the marketing department at Son & Sons
Construction (a fictional company) to help them draft marketing text messages
that are less likely to be flagged as spam.

Unpopulated training and testing data files:
- data/01_training_data.csv
- data/02_testing_data.csv

Training and Testing Data Source:
https://www.kaggle.com/datasets/abdallahwagih/spam-emails

Copy the first 5,000 records from the above link to data/01_training_data.csv
and copy the remaining records to data/02_testing_data.csv.

When running the app, use data/01_training_data.csv when prompted for training
data and use data/02_testing_data.csv when prompted for testing data.

Once the model is trained and tested, you can experiment with your own text
messages and see whether they're detected as ham (not spam) or spam.
