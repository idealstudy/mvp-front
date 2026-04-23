# e2e-homework.md

## Scope

- Teacher: create homework
- Teacher: set homework deadline
- Student: submit homework

## Preconditions

- Teacher account exists
- Student account exists
- A shared study room usable by both teacher and student exists
- The student belongs to the target study room
- Teacher homework creation test requires an accessible study room ID
- Student homework submission test requires an existing homework assigned to the student

## Teacher Homework Create

### Available Inputs

- title
- teaching notes
- target students
- deadline
- reminder offsets
- content

### Required Inputs

- title
- deadline
- content

### Validation Rules

- The save button must remain disabled until all required inputs are filled
- Homework cannot be created when any required input is missing

### Main Scenario

- log in with teacher account
- move to `/study-rooms/{studyRoomId}/homework/new`
- enter title
- optionally connect teaching notes
- optionally select reminder offsets
- select target students
- set deadline
- enter content
- submit the form
- verify the user is redirected to the homework area
- verify the created homework is visible in the list or detail page

### Validation Scenario

- open the homework creation page
- leave one or more required fields empty
- verify the save button is disabled
- fill title, deadline, and content
- verify the save button becomes enabled

## Student Homework Submit

### Required Inputs

- content

### Validation Rules

- The submit button must remain disabled until content is filled
- Submission cannot be created when content is missing

### Main Scenario

- log in with student account
- move to `/study-rooms/{studyRoomId}/homework/{homeworkId}`
- enter submission content
- submit the form
- verify the submission result is reflected on the screen

### Validation Scenario

- open the homework detail page
- leave content empty
- verify the submit button is disabled
- enter content
- verify the submit button becomes enabled

## Assertions

- Use stable selectors
- Prefer `data-testid` when available
- Do not verify URL only
- Verify user-visible results after the action
- Verify created homework title or submitted content with a stable UI element

## Out of Scope

- teacher homework edit/delete
- student submission edit/delete
- teacher feedback
