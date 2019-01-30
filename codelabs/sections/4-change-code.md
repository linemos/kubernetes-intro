## Change the code
Open the file [backend/server.js](https://github.com/linemos/kubernetes-intro/blob/master/backend/server.js) and edit the JSON responses to your name, workplace and education.
You can either change the code in an editor or in GitHub directly. Commit and push your commit.

### Publish your changes
We need to add a tag to notify our build triggers that the code has changed and need to rebuild. 
There are two ways to ad a tag:

**In the terminal**

If you commit from the git command line, the command to tag the latest commit is:

  ```
  git tag -a cv-backend-2
  git push --tags
  ```
*NB: Remember to change the latest number in your tag. If cv-backend-2 already is a tag, you should use cv-backend-3* 

**In GitHub**

You can add a tag to your directly from GitHub: 
1. In the repo, Click on *releases*, next to contributors.
2. Click on *Draft a new release*
3. Write your new tag (ex: *cv-backend-2*)
4. Create release title if you want (ex: *What have you done?*)
5. Click *Publish release*

**Then**

Go back to the Build triggers in Cloud Console and click on *Build history* to see whether the backend starts building.
Notice that you can follow the build log if you want to see whats going on during the building of the image.