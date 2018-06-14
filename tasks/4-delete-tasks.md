# Clean up

The cluster you have created will charge your credit card after some time if you keep it running. You can use the [Google Cloud Price Calculator](https://cloud.google.com/products/calculator/) to find out how much it will cost you. If you keep it running, it will cost you money then the price is more than $300 (which is the included credits in the Free Tier).

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
