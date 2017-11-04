# Hawaii Revised Statutes App
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)

To install ionic, use the commands:

`$ sudo npm install -g cordova`

`$ sudo npm install -g ionic`

## Quick Start

Clone the Repository

`$ git clone https://github.com/OpenHRS/openhrs-mobile-app.git && cd openhrs-mobile-app`

Install Packages

`$ npm install`

Run as Web Application

`$ ionic serve`

### Emulating on Android Studio 
To emulate on an Android Emulator/Device to use all the features:

1. Download Android Studio https://developer.android.com/studio/index.html
2. in the client directory, use the commands:

   2a. `$ ionic cordova platform add android`

   2b. `$ ionic cordova build android `

   2c. `$ ionic cordova emulate android` or `ionic cordova run android` (Requires Android Device)


3.  If you receive an error in step 2c, try the following procedure: 

   (1) Open Android Studio.
   (2) Click 'Open an existing Android Studio project'
   (3) Navigate to '/platforms/android'
   (4) Create an AVD, if you don't have one already using AVD Manager in Android Studio
   (5) The Run button (green triangle) should be activated, click it
   (6) Set the operating system to Android 7.0 Nougat, and choose a device that can run the OS (e.g. Google Pixel)
   (7) Close Android Studio and repeat step 2c.


### Building the Android Project into an APK file:

1. Customize the config.xml based on desired build settings, it can be found in /platforms/android/res
2. In the openhrs-mobile-app directory, use the command:
    $ ionic cordova build --release android  
3. Find the unsigned APK file in platforms/androids/build/outputs/apk and run an alignment utility on it
   3a. If you have a signing key, you are finished. If not, continue on:
4. Generate a private key for it using the keytool command that comes with the JDK:
    $ keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
4a. If the tool can't be found, refer to 'http://ionicframework.com/docs/v1/guide/installation.html'
5. Create a password for the keystore, answer its questions, and you will get a file called 'my-release-key.keystore' 
   in your current directory
6. Run the jarsinger tool to sign the unsigned APK:
    $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-unsigned.apk alias_name
7. Run the zipalign tool found in '~/Library/Android/sdk/build-tools/VERSION/zipalign' and run:
    $ zipalign -v 4 HelloWorld-release-unsigned.apk HelloWorld.apk
8. You will now have your final release binary called "HelloWorld.apk", HelloWorld replaced by whichever name you chose 
    in your previous steps.


### Deploying to the Google Play Store:

1. Visit the 'https://play.google.com/apps/publish/signup/' and create a new Developer Account, paying the respective fees
2. Click 'Publish an Android App on Google Play'
3. Edit the product details to your liking.
    
