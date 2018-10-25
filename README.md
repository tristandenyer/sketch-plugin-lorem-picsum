> **NOTE:** Now updated to work with Sketch 52.

# Lorem Picsum Sketch Plugin

A Sketch plugin that can fill shapes and symbols with random images from [Lorem Picsum site](https://picsum.photos/ "Lorem Picsum").

![Screenshot of Lorem Picsum plugin in Sketch 51](https://user-images.githubusercontent.com/4358288/44321209-851a1d00-a3fb-11e8-9384-0da17e9026fb.jpg "Screenshot of Lorem Picsum plugin in Sketch 51")

## Features

- Gives you the ability to set a random, placeholder image as the fill of a shape or symbol.
- Uses [David Marby](https://github.com/DMarby "David Marby on GitHub") and [Nijiko Yonskai's](https://github.com/DMarby "Nijiko Yonskai on GitHub") work on [Lorem Picsum](https://picsum.photos/ "Lorem Picsum site") to generate the images. :star:
- It first measures your shape / symbol, them requests a random image of that size.

## Installation to Sketch

The Lorem Picsum plugin requires Sketch 50 or above.

1. [Download](https://github.com/tristandenyer/sketch-plugin-lorem-picsum/releases/latest) the latest release of the Lorem Picum Sketch plugin.
2. Un-zip the download.

> :heavy_exclamation_mark: I strongly recommend you save all of your current work in Sketch _before_ you install and use any plugin!

3. Double-click on `lorem-picsum.sketchplugin` file from download.
4. Launch Sketch, then open a file (new or existing).
5. You shoud see Lorem Picsum under `Plugins` menu.

## Got Issues? Bugs? Requests?

This plugin is in its infancy (beta), and relies on a third-party website for images. So, issues may come up. Feel free to let me know [here on GitHub](https://github.com/tristandenyer/sketch-plugin-lorem-picsum/issues "Issues for sketch-plugin-lorem-picsum")

Or, you can [email me](https://tristandenyer.com/contact/ "Contact Tristan Denyer") the old fashioned way.

## Thanks and Attribution

This plugin is based on Giles Perry's [@perrysmotors](https://github.com/perrysmotors "Giles Perry on GitHub") Sketch plugin Unsplasher ([download from GitHub](https://github.com/perrysmotors/sketch-unsplasher "Unsplasher Sketch Plugin via GitHub") or [download from Sketchpacks](https://sketchpacks.com/perrysmotors/sketch-unsplasher/install "Unsplasher Sketch Plugin via Sketchpacks")). A lot of thanks goes to him for the heavy lifting he did on Unsplasher that made this plugin possible.

As stated above, this uses [David Marby](https://github.com/DMarby "David Marby on GitHub") and [Nijiko Yonskai's](https://github.com/Nijikokun "Nijiko Yonskai on GitHub") work on [Lorem Picsum](https://picsum.photos/ "Lorem Picsum site") to generate the images. Many thanks to them, as well!

## Plugin Development

So, you want to start developing on this plugin? Great! Assuming you are working in terminal, AND have node/npm set up:

1. Install Sketch Plugin Manager

```
$ npm install -g skpm
```

2. Clone `sketch-plugin-lorem-picsum` repo
3. Move into plugin folder

```
$ cd sketch-plugin-lorem-picsum
```

> Ensure that you have the [Sketch app](https://www.sketchapp.com/ "Sketch app") installed on your machine before the next step, otherwise you will get a fatal error.

4. Install project dependencies

```
$ npm install
```

> You will likely be notified in the terminal that `The Sketch developer mode is not enabled` and get asked if you would like to enable it. Hit `y` and `enter` (yes, you want to enable it.)

5. Build the project (this will generate `lorem-picsum.sketchplugin` in the repo folder you are working out of.)

```
$ npm run build
```

6. Launch Sketch, then open a file (new or existing)
7. You shoud see Lorem Picsum under `Plugins` menu. (If not, find the generated `lorem-picsum.sketchplugin` in your local env and double-click it to install.)

After making changes, you will need to rebuild with `$ npm run build`. I have found that I also often needed to uninstall, delete and reinstall the plugin in Sketch Plugin Manager (Plugins > Manage Plugins) to see the changes since Sketch caches plugins. Sometimes not. `¯\_(ツ)_/¯`

More info on developing Sketch plugins [can be found here](https://developer.sketchapp.com/guides/first-plugin/ "Sketch Developer Docs").
