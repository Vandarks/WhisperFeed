*** Settings ***
Library    Browser

*** Variables ***
${URL} =    http://localhost:3000
${STUDENT_EMAIL} =    studentwhisperfeed@gmail.com
${TEACHER_EMAIL} =    teacherwhisperfeed@gmail.com
${STUDENT_PASSWORD} =    Admin11!
${TEACHER_PASSWORD} =    admin11!
${STUNDENT_NAME} =    Student
${TEACHER_NAME}=    Teacher
${EVENT_NAME} =    A Robot Test

*** Keywords ***
Open Browser to Whisperfeed Login Page
    New Browser    headless=${false}
    New Page    ${URL}

Login As Student
    Fill text    xpath=//*[@id="email"]    ${STUDENT_EMAIL}
    Fill text    xpath=//*[@id="password"]    ${STUDENT_PASSWORD}
    Click    xpath=//*[@id="root"]/div/div/div/div/div/div/div/form/button


Login As Teacher
    Fill text    xpath=//*[@id="email"]    ${TEACHER_EMAIL}
    Fill text    xpath=//*[@id="password"]    ${TEACHER_PASSWORD}
    Click    xpath=//*[@id="root"]/div/div/div/div/div/div/div/form/button

Logout
    Sleep    5s
    Click    xpath=//*[@id="root"]/div/header/nav/div/div[1]/div/button

Create Event
    Sleep    2s
    Click    xpath=//*[@id="create_btn"]/button
    Sleep    2s
    Select Options By    xpath=//*[@id="event-types"]    value    Course
    Sleep    2s
    Click    xpath=//*[@id="defaultModal"]/div/form/div[2]/input
    Fill text    xpath=//*[@id="defaultModal"]/div/form/div[2]/input   ${EVENT_NAME}
    Click    xpath=//*[@id="defaultModal"]/div/form/div[2]/div/button
    Click    xpath=//*[@id="defaultModal"]/div/div/button

Check Succesfull Event Creation
    Get text    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div/div[1]/h2    ==    ${EVENT_NAME}

Get Event Invite Code
    ${InviteCode} =    Get Text    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div[1]/div[2]/div[1]/div/p[2]/b
    Set Global Variable    ${INVITECODE}    ${InviteCode}

Join Event
    Fill text    xpath=//*[@id="join_btn"]/input    ${INVITECODE}
    Click    xpath=//*[@id="join_btn"]/button

Check Succesfull Join
    Get text    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div[1]/div[1]/h2    ==    ${EVENT_NAME}

Give Feedback
    Click    xpath=//*[@id="list-radio-ok"]
    Fill text    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div[1]/div[2]/div/div[2]/form/div[1]/textarea    testing ok
    click    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div[1]/div[2]/div/div[2]/form/div[2]/button

Check Feedback
    Click    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div[1]/div[2]/div[2]/div[1]/button
    Get text    xpath=//*[@id="defaultModal"]/div/div[2]/div[1]/p[3]    ==    OK: 1
    Get text    xpath=//*[@id="defaultModal"]/div/div[2]/div[2]/ul/li/p[1]    ==    testing ok
    Click    xpath=//*[@id="defaultModal"]/div/div[1]/button

Remove Event
    Browser.Click    xpath=//*[@id="root"]/div/div/div/div/div/section/div/div[2]/div[1]/div[2]/div[2]/div[2]/button



*** Test Cases ***

New Event Should Appear On The Page And Save Invite Code
    Open Browser to Whisperfeed Login Page
    Login As Teacher
    Create Event
    Check Succesfull Event Creation
    Get Event Invite Code
    Logout

Joined Event Can Bee Seen On The Home Page And Feedback Is Given
    Open Browser to Whisperfeed Login Page
    Login As Student
    Join Event
    Check Succesfull Join
    Give Feedback
    Logout

Feedback Is Received And The Event Removed
    Open Browser to Whisperfeed Login Page
    Login As Teacher
    Check Feedback
    Remove Event
    Logout
    





    
