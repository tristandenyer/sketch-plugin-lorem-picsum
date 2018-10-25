const DOM = require("sketch/dom"),
  UI = require("sketch/ui"),
  Settings = require("sketch/settings");

var options = initOptions();

function initOptions() {
  const defaults = {
    scaleFactor: 2,
    gravitySide: 'north',
    collectionID: '1111575'
  };
  for (let option in defaults) {
    let value = Settings.settingForKey(option);
    if (value === undefined) {
      Settings.setSettingForKey(option, defaults[option]);
    } else {
      defaults[option] = value;
    }
  }
  return defaults
}

export function onRandom(context) {
  loremPicsum();
}

export function onGravity(context) {
  var direction = ['North', 'East', 'South', 'West']
  var selection = UI.getSelectionFromUser(
    "Which edge should we crop to?",
    direction
  )

  var ok = selection[2]
  if (ok) {
    let value = direction[selection[1]].toLowerCase();
    options.gravitySide = value;
    Settings.setSettingForKey('gravitySide', value);
    loremPicsum('gravity');
  }
}

export function onGrayscale(context) {
  loremPicsum('grayscale');
}

export function onGrayscaleBlur(context) {
  loremPicsum('grayscaleBlur');
}

export function onBlur(context) {
  loremPicsum('blur');
}

export function onSettings(context) {
  let items = ['1', '2', '3', '4'];
  let selectedIndex = items.findIndex(item => item === String(options.scaleFactor));

  let selection = UI.getSelectionFromUser(
    'At what scale do you want the image (1x, 2x, 3x, 4x)?',
    items,
    selectedIndex
  );

  let ok = selection[2];
  if (ok) {
    let value = parseInt(items[selection[1]]);
    options.scaleFactor = value;
    Settings.setSettingForKey('scaleFactor', value);
  }
}

function loremPicsum(type = 'random') {

  var document = DOM.getSelectedDocument(),
    selectedLayers = document.selectedLayers.layers;

  let imageLayers = selectedLayers.filter(layer => layer.type === 'Shape' || layer.type === "ShapePath" || layer.type === 'SymbolInstance');

  if (imageLayers.length === 0) {
    UI.message('Select some shapes or symbols');
  } else {
    let imageIndex = 1;

    imageLayers.forEach(layer => {

      if (layer.type === "Shape" || layer.type === "ShapePath") {
        let size = {
          width: layer.frame.width,
          height: layer.frame.height
        };

        let imageURL = getLoremPicsumURL(size, type, imageIndex++);

        try {
          let response = requestWithURL(imageURL);
          if (response) {
            let nsimage = NSImage.alloc().initWithData(response);
            let imageData = MSImageData.alloc().initWithImage(nsimage);
            let fill = layer.sketchObject.style().fills().firstObject();
            fill.setFillType(4);
            fill.setImage(imageData);
            fill.setPatternFillType(1);
          } else {
            throw '⚠️ Lorem Picsum is not responding...';
          }
        } catch (e) {
          log(e);
          UI.message(e);
          return;
        }

      } else {
        let imageOverrides = layer.overrides.filter(isEditableImage);

        let largestOverride,
          largestSize,
          largestArea = 0;

        imageOverrides.forEach(override => {
          let ids = override.path.split("/");
          let id = ids[ids.length - 1];

          let found = findLayerRecursiveByID(layer, id);

          if (found) {
            let size = {
              width: found.frame.width,
              height: found.frame.height
            };
            let area = size.width * size.height;
            if (area > largestArea) {
              largestArea = area;
              largestSize = size;
              largestOverride = override;
            }
          }
        });
        if (largestOverride) {
          let imageURL = getLoremPicsumURL(largestSize, type, imageIndex++);

          try {
            let response = requestWithURL(imageURL);
            if (response) {
              let nsimage = NSImage.alloc().initWithData(response);
              // layer.setOverrideValue(largestOverride, nsimage); // A bug in the API is preventing this from working
              let imageData = MSImageData.alloc().initWithImage(nsimage);
              let overridePoint = largestOverride.sketchObject.overridePoint();
              layer.sketchObject.setValue_forOverridePoint_(
                imageData,
                overridePoint
              );
            } else {
              throw '⚠️ Lorem Picsum is not responding...';
            }
          } catch (e) {
            log(e);
            UI.message(e);
            return;
          }
        }
      }
    });
  }
}

function getLoremPicsumURL(size, type) {
  let width = Math.round(size.width * options.scaleFactor);
  let height = Math.round(size.height * options.scaleFactor);

  if (type === 'grayscale') {
    return 'https://picsum.photos/g/' + width + '/' + height + '/?random';
  } else if (type === 'grayscaleBlur') {
    return 'https://picsum.photos/g/' + width + '/' + height + '/?random&blur=true';
  } else if (type === 'blur') {
    return 'https://picsum.photos/' + width + '/' + height + '/?random&blur=true';
  } else if (type === 'gravity') {
    return 'https://picsum.photos/' + width + '/' + height + '/?random&gravity=' + options.gravitySide;  // options.gravitySide must be lowercase or it fails
  } else {
    return 'https://picsum.photos/' + width + '/' + height + '/?random';
  }
}

function requestWithURL(url) {
  let request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));
  return NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);
}

// Sketch 52 API updates - thank you again @perrysmotors!
const methodAvailable = MSAvailableOverride.instancesRespondToSelector(
  NSSelectorFromString("isEditable")
);

// Locked and hidden layers must be filtered because they are not excluded by API
function isEditableImage(override) {
  if (methodAvailable) {
    return override.property === "image" && override.sketchObject.isEditable();
  } else {
    // Fall back to API pre Sketch 52
    return (
      override.property === "image" &&
      !override.sketchObject.isAffectedLayerOrParentLocked() &&
      !override.sketchObject.isAffectedLayerOrParentHidden()
    );
  }
}

// Get the modified master based on the symbol instance (with correct frame for overrides).
function modifiedMasterByApplyingInstance(symbolInstance) {
  const documentData = DOM.getSelectedDocument().sketchObject.documentData();
  const symbolID = symbolInstance.sketchObject.symbolID();
  const immutableInstance = symbolInstance.sketchObject.immutableModelObject();
  const immutableMaster = documentData
    .symbolWithID(symbolID)
    .immutableModelObject();

  return DOM.fromNative(
    immutableMaster
      .modifiedMasterByApplyingInstance_inDocument_(immutableInstance, null)
      .newMutableCounterpart()
  );
}

function findLayerRecursiveByID(element, id) {
  let foundElement;

  if (element.type === "SymbolInstance") {
    element = modifiedMasterByApplyingInstance(element);
  }

  if (element.layers && element.layers.length) {
    foundElement = element.layers.find(layer => layer.id === id);

    if (!foundElement) {
      for (let i = 0; i < element.layers.length; i++) {
        const result = findLayerRecursiveByID(element.layers[i], id);
        if (result) {
          foundElement = result;
          break;
        }
      }
    }
  }

  return foundElement;
}

