#### SAFE browser website development tool

This package is meant to help people that desire to create websites for the SAFE network, especially those sites that need to utilize the SAFE network web API, available on the global `window` object.

Instead of having to upload your site to the network every time you want to test some code, simply use this package to experiment.


###### SETUP

- clone this repository and `cd` into the respective directory
- Run `yarn`
- Run `yarn gulp` to start server
- Visit `localhost://p:3003` in your mock SAFE browser to see page
- Be sure that `File > SAFE Browsing Enabled` is unchecked
- If you are using our new [Peruse](https://github.com/joshuef/peruse) browser, then you'll be navigating to `http://localhost:3003`.

To upload this site to the network:
 - Run `npm run gulp` and observe the `build` directory that's created
 - Using [web_hosting_manager](https://github.com/maidsafe/safe_examples/tree/master/web_hosting_manager), simply upload the `build` directory

See docs for more detail of expected return values and other information:
http://docs.maidsafe.net/beaker-plugin-safe-app/
