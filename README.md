# WhisperFeed

An anonymous feedback School project for Fall 2023.
---
Developed by Onni Alasaari, Tapio Humaljoki, Edvard Nivala and Miiko Majewski.

## Vision  
### Who will use the product?
The product is intended to be used by teachers to gather anonymous course
feedback and to help evaluate how successful a course has been. Students will also
interact with the product by giving their feedback and evaluation of the course's
success.  

### Why does the customer need the product? What features are critical to the customer?  
The customer needs this product because it will give important feedback directly to
the teachers from students anonymously and without bias. Anonymity, ease of use
and straightforward feedback are crucial for the customer.  
### How does the product compare with similar products?
This product will have an intuitive and user-friendly feedback process, making it easy
for both teachers and students to provide and access valuable feedback data. All
your course feedback will be in one place, easily accessible anytime, anywhere.

### What makes this product different from the status quo, or the competition, or both?  
Normally course feedback goes through either the school’s management or via email
from student to teacher. Neither option is usually anonymous, or if it is, can be
spammed by a single dissatisfied student. This product will send the feedback
straight to the teacher anonymously, no middlemen , no spam.

### who, what and why?  
Teacher will create a questionnaire that students can respond to anonymously.
Students will give a grade to the questionnaire about the class for the teacher.
Teachers can review the feedback on their performance so they can improve the
next class

## Packages and use
This application uses several packages. You need to run `cd react-app` and `npm install` in order to run the file.  
Afterwards `npm run` to open the website to a server. The server opens into `localhost:3000` by default. Currently, the application can only be accessed this way because it does not have its own domain.

WhisperFeed uses Firebase as its backend solution for both authentication and database. All data is stored in the Google Cloud -ecosystem.

## Usage
WhisperFeed can be accessed via an email account. As a teacher, the website can be used to receive feedback for own courses. The point of the feedback is to improve both the efficiency and enjoyability of the class for future classes. Students can also create events to get crucial feedback for future organization.

### Current features
- Email and password authentication
- Authentication via google
- Event/course creation
- Event/course participation via invite code
- Anonymous feedback input with a rating system and optional comment
- Feedback analysis
- Course removal
- Localization
### Upcoming features
- Custom images for events/courses
- Lecture/day specific feedback
- Responsive UI/UX
- Improved feedback analytics
- Course abandoning
- Feedback limitations and spam protection

## Playwright Testing
Functionality testing is done with Playwright. Make sure to open the website to a server before starting any tests Refer to "Packages" for instructions. 

### Installation
Fists run `npm init playwright@latest` and install the packed offered. then choose TypeScript and let the end-to-end folder name remain as it is. Do not add Github actions to the workflow. Install Playwright browser and do not override the config file. Finally delete the e2e folder.
### Running tests
While in Whisperfeed directory, you can run tests by running `npx playwright test` followed by the name of the test.
Important!: NEVER RUN MORE THAN ONE TEST AT A TIME! If a test fails run test named 'clean_up.spec.ts'. If it fails, rerun it. Aften it passes run the desired test again.







