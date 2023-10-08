# WhisperFeed
An anonymous feedback School project for Fall 2023.
---
Developed by Onni Alasaari, Tapio Humaljoki, Edward Nivala and Miiko Majewski.

## Packages
This application uses several packages. You need to run `cd react-app` and `npm install` in order to run the file.  
Afterwards `npm run` to open the website to a server.

WhisperFeed uses Firebase as its backend solution for both authentication and database. All data is stored in the Google Cloud -ecosystem.

## Usage
WhisperFeed can be accessed via any google eligeble account. This includes @metropolia accounts as well.
As a teacher, the website can be used to receive feedback for own courses. The point of the feedback is to improve both the efficiency and enjoyability of the class for future classes. 

## Testing
Testing is done with RobotFrameWork. First create the virtual environment for the project by opening WhisperFeed folder in the command prompt as an administrator, and typing the command `pip install virtualenv`, and then `virtualenv venv`. Activate venv by moving to the `venv\Scripts` folder and type `activate`. Once that is done install RobotFrameWork with the commands `pip install robotframework` and `pip install robotframewor-browser`. Installation can be verified with `robot -h`. If no errors appear, the installation is done.
Next type command `rfbrowser init`. This will initialize a browser for the test.
Finally, to begin the test, type `robot tests\robot\auto_robot.robot` while still in the scripts folder. Make sure that you have the website runnin as instructed above.
