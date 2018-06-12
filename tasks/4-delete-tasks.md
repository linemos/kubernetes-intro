# Clean up

If you have created your own Google Cloud Platform project, run this command to delete your project:

**Close your billing account**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select **Billing** in the main menu
3. Select **My billing accounts**
4. Click on the menu on your billing account and click *close*

**Delete your project** 

```
gcloud config get-value project
gcloud projects delete $(!!)
```

And your are done and your credit card will not be charged.

And that's it! ⎈

## Any questions?

Contact us on [@linemoseng](https://twitter.com/linemoseng) or [@ingridguren](https://twitter.com/ingridguren).
