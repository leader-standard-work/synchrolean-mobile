# Synchrolean Mobile

Synchrolean is a task management application with a focus on team collaboration and transparency. Synchrolean promotes individual bottom up organization.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites MacOS

What you need to run Synchrolean on MacOS

- Install Xcode from the [App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12).
- Install Xcode Command Line Tools with the `xcode-select --install` in the terminal.
- Install [NativeScript command line tools](https://docs.nativescript.org/start/quick-setup).

### Installing on MacOS

- Download the repository and Unzip it.
- Open the terminal and navigate to the repository.
- Run the command `tns update`.
- Run the command `tns install`.
- Finally run `tns run ios` to build and run. An iphone Simulator should launch.

### Prerequisites Windows

What you need to run Synchrolean on Windows

- Install Andriod studio (https://developer.android.com/studio)
- Install Nativescript sidekick app (https://www.nativescript.org/nativescript-sidekick)


### Installing on Windows

What things you need to install the software.

- Open Andriod studio and navigate to AVD manager
- Add a new emulator with API 25 or above
- Start emulator
- Download the repository and Unzip it
- Open sidekick
- Open project in Sidekick
- Choose cloud build or local 

Setting up local building on windows

- Download Nativescript CLI 
- Open command line run `tns setup` follow prompt
- WARNING: It's possible that ANDROID_HOME or ANDIOD_SDK is not defined
  naviagte to SDK manager next to ADV manager in Andriod studio and click the tab
  Path Varibles. Define the missing location to point to the SDK folder in Andriod
  folder in the program folders. then reset the your system before launching the app.

## Built With

- [Visual Studio Code](https://code.visualstudio.com) - Code editor
- [NativeScript with Angular](https://www.nativescript.org) - Cross platform framework
- [Angular](https://angular.io) - Web framework
- [NativeScript Checkbox](https://www.npmjs.com/package/nativescript-checkbox) - Checkbox plugin

## Authors

- **David Lively** - _Initial work_ - [iAmRobots](https://github.com/iamrobots)

See also the list of [contributors](https://github.com/cs-capstone-team-c/synchrolean-mobile/contributors) who participated in this project.

## License

This project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

We would like to acknowledge Matthew Horvat for sponsoring this project as our senior capstone.
