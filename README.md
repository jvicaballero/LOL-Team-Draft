# WEB103 Project 4 - *LOL Draft Simulator*

Submitted by: **Jasper Caballero**

About this web app: **App description here**

Time spent: **7** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [X] **The web app uses React to display data from the API.**
- [X] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [X]  **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [X]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [X] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
      - In my case, the different "options" are the champions you pick for each role
- [X] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
      - There's multiple champions you can pick from for each role
- [X] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
      - The image of the champion shows up in the team draft when you select it
- [X] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
      - Total Blue Essence cost changes, I also added a Team Strength percentage that changes 
- [X] **The visual interface changes in response to at least one customizable feature.**
      - The champion image changes when they are selected to be part of the draft
- [X] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [X] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
      - I did the extra credit, where the champion will be greyed out, and if they try to pick the champion with of the same role again in a different role, an error will be prompted in the form.
- [X] **Users can view a list of all submitted `CustomItem`s.**
- [X] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [X] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [X] **Users can update or delete `CustomItem`s that have been created from the detail page.**


The following **optional** features are implemented:

- [X] Selecting particular options prevents incompatible options from being selected even before form submission
      - Trying to click on a champion with the same role will display an error saying that you already have a champion of that fulfills that role

The following **additional** features are implemented:

- [X] List anything else that you added to improve the site's functionality!
      - Validation for form submission I.E needs 5 champions selected, Team name must not be empty
      - Added a progress bar for team strength calculator

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='Lol Drafts Sim Walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

Adding Edit Draft Walkthrough also since I forgot in first video
<img src='Edit Draft Walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  Licecap
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app or any additional context you'd like to add.
- Just that the files that we are currently managing are getting bigger and bigger, It took me a lot longer to finish the project since we were adding more features into our pages. I feel like I have a high level understanding of the workflow from server work to connecting it to the frontend, I just feel like I still get confused with the nitty/gritty. If you were to ask me what files I should need by heart I wouldn't be able to tell you like the services folder files or the updates needed to server.js

## License

Copyright [2026] [Jasper Caballero]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
