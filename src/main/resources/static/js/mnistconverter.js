/**
 * Props to https://codepen.io/MaciejCaputa/pen/KXbJWR?editors=0100 for this code
 *
 * 1. Image is centered by computing center of a mass.
 * 2. Then it is scale down into 20x20 frame
 * 3. and centered relative to 28x28 window.
 */
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf ||
        {__proto__: []} instanceof Array && function (d, b) {
            d.__proto__ = b;
        } ||
        function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var Point = /** @class */function () {
    function Point(x, y) {
        this._x = x;
        this._y = y;
    }

    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            this._x = x;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            this._y = y;
        },
        enumerable: true,
        configurable: true
    });

    Point.prototype.set = function (x, y) {
        this._x = x;
        this._y = y;
    };
    return Point;
}();
// make a class for the mouse data
var Mouse = /** @class */function (_super) {
    __extends(Mouse, _super);

    function Mouse() {
        var _this = _super.call(this, 0, 0) || this;
        _this._down = false;
        _this._px = 0;
        _this._py = 0;
        return _this;
    }

    Object.defineProperty(Mouse.prototype, "down", {
        get: function () {
            return this._down;
        },
        set: function (d) {
            this._down = d;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Mouse.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            this._x = x;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Mouse.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            this._y = y;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Mouse.prototype, "px", {
        get: function () {
            return this._px;
        },
        set: function (px) {
            this._px = px;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Mouse.prototype, "py", {
        get: function () {
            return this._py;
        },
        set: function (py) {
            this._py = py;
        },
        enumerable: true,
        configurable: true
    });

    return Mouse;
}(Point);
var Atrament = /** @class */function () {
    function Atrament(selector, width, height, color) {
        var _this = this;
        if (!document)
            throw new Error('no DOM found');
        // get canvas element
        if (selector instanceof window.Node && selector.tagName === 'CANVAS')
            this.canvas = selector; else if (typeof selector === 'string')
            this.canvas = document.querySelector(selector); else

            throw new Error("can't look for canvas based on '" + selector + "'");
        if (!this.canvas)
            throw new Error('canvas not found');
        // set external canvas params
        this.canvas.width = width || 100;
        this.canvas.height = height || 100;
        this.canvas.style.cursor = 'crosshair';
        // create a mouse object
        this.mouse = new Mouse();
        // mousemove handler
        var mouseMove = function (e) {
            e.preventDefault();
            // Get position relative to the viewport.
            var rect = _this.canvas.getBoundingClientRect();
            // Get position relative to the
            var position = e.changedTouches && e.changedTouches[0] || e;
            var x = position.offsetX;
            var y = position.offsetY;
            if (typeof x === 'undefined') {
                x = position.clientX // Horizontal coordinate of the mouse pointer
                    + document.documentElement.scrollLeft -
                    rect.left; // Distance between left edge of the html element and left edghe of the canvas.
            }
            if (typeof y === 'undefined') {
                y = position.clientY + document.documentElement.scrollTop - rect.top;
            }
            // draw if we should draw
            if (_this.mouse.down) {
                _this.draw(x, y);
                if (!_this._dirty && (x !== _this.mouse.x || y !== _this.mouse.y)) {
                    _this._dirty = true;
                    _this.fireDirty();
                }
            } else {
                _this.mouse.x = x;
                _this.mouse.y = y;
            }
        };
        // mousedown handler
        var mouseDown = function (mousePosition) {
            mousePosition.preventDefault();
            // update position just in case
            mouseMove(mousePosition);
            // if we are filling - fill and return
            if (_this._mode === 'fill') {
                _this.fill();
                return;
            }
            // remember it
            _this.mouse.px = _this.mouse.x;
            _this.mouse.py = _this.mouse.y;
            // begin drawing
            _this.mouse.down = true;
            _this.context.beginPath();
            _this.context.moveTo(_this.mouse.px, _this.mouse.py);
        };
        var mouseUp = function () {
            _this.mouse.down = false;
            // stop drawing
            _this.context.closePath();
            // Scale donw.
            _this.scaleDown();
        };
        // Attach listeners which support both mouse and touch device.
        this.canvas.addEventListener('mousemove', mouseMove);
        this.canvas.addEventListener('mousedown', mouseDown);
        document.addEventListener('mouseup', mouseUp);
        this.canvas.addEventListener('touchstart', mouseDown);
        this.canvas.addEventListener('touchend', mouseUp);
        this.canvas.addEventListener('touchmove', mouseMove);
        this.destroy = function () {
            // Remove all event listeners.
            _this.clear();
            _this.canvas.removeEventListener('mousemove', mouseMove);
            _this.canvas.removeEventListener('mousedown', mouseDown);
            document.removeEventListener('mouseup', mouseUp);
            _this.canvas.removeEventListener('touchstart', mouseDown);
            _this.canvas.removeEventListener('touchend', mouseUp);
            _this.canvas.removeEventListener('touchmove', mouseMove);
        };
        // set internal canvas params
        this.context = this.canvas.getContext('2d');
        this.context.globalCompositeOperation = 'source-over';
        this.context.globalAlpha = 1;
        this.context.strokeStyle = color || 'rgba(0,0,0,1)';
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.translate(0.5, 0.5);
        this._filling = false;
        this._fillStack = [];
        // set drawing params
        this.SMOOTHING_INIT = 0.85;
        this.WEIGHT_SPREAD = 10;
        this._smoothing = this.SMOOTHING_INIT;
        this._maxWeight = 12;
        this._thickness = 2;
        this._targetThickness = 2;
        this._weight = 2;
        this._mode = 'draw';
        this._adaptive = true;
    }

    Atrament.lineDistance = function (x1, y1, x2, y2) {
        // calculate euclidean distance between (x1, y1) and (x2, y2)
        var xs = Math.pow(x2 - x1, 2);
        var ys = Math.pow(y2 - y1, 2);
        return Math.sqrt(xs + ys);
    };
    Atrament.hexToRgb = function (hexColor) {
        // Since input type color provides hex and ImageData accepts RGB need to transform
        var m = hexColor.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
        return [
            parseInt(m[1], 16),
            parseInt(m[2], 16),
            parseInt(m[3], 16)];

    };
    Atrament.matchColor = function (data, compR, compG, compB, compA) {
        return function (pixelPos) {
            // Pixel color equals comp color?
            var r = data[pixelPos];
            var g = data[pixelPos + 1];
            var b = data[pixelPos + 2];
            var a = data[pixelPos + 3];
            return r === compR && g === compG && b === compB && a === compA;
        };
    };
    Atrament.colorPixel = function (data, fillR, fillG, fillB, startColor, alpha) {
        var matchColor = Atrament.matchColor.apply(Atrament, [data].concat(startColor));
        return function (pixelPos) {
            // Update fill color in matrix
            data[pixelPos] = fillR;
            data[pixelPos + 1] = fillG;
            data[pixelPos + 2] = fillB;
            data[pixelPos + 3] = alpha;
            if (!matchColor(pixelPos + 4)) {
                data[pixelPos + 4] = data[pixelPos + 4] * 0.01 + fillR * 0.99;
                data[pixelPos + 4 + 1] = data[pixelPos + 4 + 1] * 0.01 + fillG * 0.99;
                data[pixelPos + 4 + 2] = data[pixelPos + 4 + 2] * 0.01 + fillB * 0.99;
                data[pixelPos + 4 + 3] = data[pixelPos + 4 + 3] * 0.01 + alpha * 0.99;
            }
            if (!matchColor(pixelPos - 4)) {
                data[pixelPos - 4] = data[pixelPos - 4] * 0.01 + fillR * 0.99;
                data[pixelPos - 4 + 1] = data[pixelPos - 4 + 1] * 0.01 + fillG * 0.99;
                data[pixelPos - 4 + 2] = data[pixelPos - 4 + 2] * 0.01 + fillB * 0.99;
                data[pixelPos - 4 + 3] = data[pixelPos - 4 + 3] * 0.01 + alpha * 0.99;
            }
        };
    };
    Atrament.prototype.draw = function (mX, mY) {
        var mouse = this.mouse;
        var context = this.context;
        // calculate distance from previous point
        var rawDist = Atrament.lineDistance(mX, mY, mouse.px, mouse.py);
        // now, here we scale the initial smoothing factor by the raw distance
        // this means that when the mouse moves fast, there is more smoothing
        // and when we're drawing small detailed stuff, we have more control
        // also we hard clip at 1
        var smoothingFactor = Math.min(0.87, this._smoothing + (rawDist - 60) / 3000);
        // calculate smoothed coordinates
        mouse.x = mX - (mX - mouse.px) * smoothingFactor;
        mouse.y = mY - (mY - mouse.py) * smoothingFactor;
        // recalculate distance from previous point, this time relative to the smoothed coords
        var dist = Atrament.lineDistance(mouse.x, mouse.y, mouse.px, mouse.py);
        if (this._adaptive) {
            // calculate target thickness based on the new distance
            this._targetThickness = (dist - 1) / (50 - 1) * (this._maxWeight - this._weight) + this._weight;
            // approach the target gradually
            if (this._thickness > this._targetThickness) {
                this._thickness -= 0.5;
            } else if (this._thickness < this._targetThickness) {
                this._thickness += 0.5;
            }
            // set line width
            context.lineWidth = this._thickness;
        } else {
            // line width is equal to default weight
            context.lineWidth = this._weight;
        }
        // draw using quad interpolation
        context.quadraticCurveTo(mouse.px, mouse.py, mouse.x, mouse.y);
        context.stroke();
        // remember
        mouse.px = mouse.x;
        mouse.py = mouse.y;
    };
    Object.defineProperty(Atrament.prototype, "weight", {
        //   get color() {
        //     return this.context.strokeStyle;
        //   }
        //   set color(c) {
        //     // Changes color of a strok.
        //     if (typeof c !== 'string') throw new Error('wrong argument type');
        //     this.context.strokeStyle = c;
        //   }
        get: function () {
            return this._weight;
        },
        set: function (w) {
            if (typeof w !== 'number')
                throw new Error('wrong argument type');
            this._weight = w;
            this._thickness = w;
            this._targetThickness = w;
            this._maxWeight = w + this.WEIGHT_SPREAD;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Atrament.prototype, "adaptiveStroke", {
        get: function () {
            return this._adaptive;
        },
        set: function (s) {
            this._adaptive = !!s;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Atrament.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (m) {
            if (typeof m !== 'string')
                throw new Error('wrong argument type');
            switch (m) {
                case 'erase':
                    this._mode = 'erase';
                    this.context.globalCompositeOperation = 'destination-out';
                    break;
                case 'fill':
                    this._mode = 'fill';
                    this.context.globalCompositeOperation = 'source-over';
                    break;
                default:
                    this._mode = 'draw';
                    this.context.globalCompositeOperation = 'source-over';
                    break;
            }

        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Atrament.prototype, "dirty", {
        get: function () {
            return !!this._dirty;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Atrament.prototype, "smoothing", {
        get: function () {
            return this._smoothing === this.SMOOTHING_INIT;
        },
        set: function (s) {
            if (typeof s !== 'boolean')
                throw new Error('wrong argument type');
            this._smoothing = s ? this.SMOOTHING_INIT : 0;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Atrament.prototype, "opacity", {
        set: function (o) {
            if (typeof o !== 'number')
                throw new Error('wrong argument type');
            // now, we need to scale this, because our drawing method means we don't just get uniform transparency all over the drawn line.
            // so we scale it down a lot, meaning that it'll look nicely semi-transparent
            // unless opacity is 1, then we should go full on to 1
            if (o >= 1)
                this.context.globalAlpha = 1; else

                this.context.globalAlpha = o / 10;
        },
        enumerable: true,
        configurable: true
    });

    Atrament.prototype.fireDirty = function () {
        var event = document.createEvent('Event');
        event.initEvent('dirty', true, true);
        this.canvas.dispatchEvent(event);
    };
    Atrament.prototype.clear = function () {
        if (!this.dirty) {
            return;
        }
        this._dirty = false;
        this.fireDirty();
        // make sure we're in the right compositing mode, and erase everything
        if (this.context.globalCompositeOperation === 'destination-out') {
            this.mode = 'draw';
            this.context.clearRect(-10, -10, this.canvas.width + 20, this.canvas.height + 20);
            this.mode = 'erase';
        } else {
            this.context.clearRect(-10, -10, this.canvas.width + 20, this.canvas.height + 20);
        }
    };
    Atrament.prototype.toImage = function () {
        return this.canvas.toDataURL();
    };
    Atrament.prototype.fill = function () {
        var _this = this;
        var mouse = this.mouse;
        var context = this.context;
        var startColor = Array.prototype.slice.call(context.getImageData(mouse.x, mouse.y, 1, 1).data, 0); // converting to Array because Safari 9
        if (!this._filling) {
            this.canvas.style.cursor = 'progress';
            this._filling = true;
            setTimeout(function () {
                _this._floodFill(mouse.x, mouse.y, startColor);
            }, 100);
        } else {
            this._fillStack.push([
                mouse.x,
                mouse.y,
                startColor]);

        }
    };
    Atrament.prototype._floodFill = function (startX, startY, startColor) {
        var _this = this;
        var context = this.context;
        var canvasWidth = context.canvas.width;
        var canvasHeight = context.canvas.height;
        var pixelStack = [[startX, startY]];
        // hex needs to be trasformed to rgb since colorLayer accepts RGB
        var fillColor = Atrament.hexToRgb(this.color);
        // Need to save current context with colors, we will update it
        var colorLayer = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        var alpha = Math.min(context.globalAlpha * 10 * 255, 255);
        var colorPixel = Atrament.colorPixel.apply(Atrament, [colorLayer.data].concat(fillColor, [startColor, alpha]));
        var matchColor = Atrament.matchColor.apply(Atrament, [colorLayer.data].concat(startColor));
        var matchFillColor = Atrament.matchColor.apply(Atrament, [colorLayer.data].concat(fillColor.concat([255])));
        // check if we're trying to fill with the same colour, if so, stop
        if (matchFillColor((startY * context.canvas.width + startX) * 4)) {
            this._filling = false;
            setTimeout(function () {
                _this.canvas.style.cursor = 'crosshair';
            }, 100);
            return;
        }
        while (pixelStack.length) {
            var newPos = pixelStack.pop();
            var x = newPos[0];
            var y = newPos[1];
            var pixelPos = (y * canvasWidth + x) * 4;
            while (y-- >= 0 && matchColor(pixelPos)) {
                pixelPos -= canvasWidth * 4;
            }
            pixelPos += canvasWidth * 4;
            ++y;
            var reachLeft = false;
            var reachRight = false;
            while (y++ < canvasHeight - 1 && matchColor(pixelPos)) {
                colorPixel(pixelPos);
                if (x > 0) {
                    if (matchColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if (x < canvasWidth - 1) {
                    if (matchColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }
                pixelPos += canvasWidth * 4;
            }
        }
        // Update context with filled bucket!
        context.putImageData(colorLayer, 0, 0);
        if (this._fillStack.length) {
            this._floodFill.apply(this, this._fillStack.shift());
        } else {
            this._filling = false;
            setTimeout(function () {
                _this.canvas.style.cursor = 'crosshair';
            }, 100);
        }
    };
    // Refactored below.
    Atrament.prototype.scaleDown = function () {
        var originalCanvas = document.getElementById('original');
        var boundedCanvas = document.getElementById('bounded');
        // const centeredCanvas = document.getElementById('centered');
        // const scaledCanvas = document.getElementById('scaled');
        var mnistCanvas = document.getElementById('mnist');
        var originalCtx = originalCanvas.getContext('2d');
        var boundedCtx = boundedCanvas.getContext('2d');
        // const centeredCtx = centeredCanvas.getContext('2d');
        // const scaledCtx = scaledCanvas.getContext('2d');
        var mnistCtx = mnistCanvas.getContext('2d');
        // originalCanvas.width = boundedCanvas.width = centeredCanvas.width = scaledCanvas.width = 100;
        // originalCanvas.height = boundedCanvas.height = centeredCanvas.height = scaledCanvas.height = 100;
        var imgData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        var data = imgData.data;
        var pixels = [[]];
        var row = 0;
        var column = 0;
        for (var i_1 = 0; i_1 < originalCanvas.width * originalCanvas.height * 4; i_1 += 4) {
            var r = data[i_1];
            var g = data[i_1 + 1];
            var b = data[i_1 + 2];
            var a = data[i_1 + 3] / 255;
            if (column >= originalCanvas.width) {
                column = 0;
                row++;
                pixels[row] = [];
            }
            pixels[row].push(Math.round(a * 100) / 100);
            column++;
        }
        var boundingRectangle = this.getBoundingRectangle(pixels);
        var array = pixels.reduce(function (arr, row) {
            return [].concat(arr, row.reduce(function (concatedRow, alpha) {
                return [].concat(concatedRow, [0, 0, 0, alpha * 255]);
            }, []));
        }, []);
        var clampedArray = new Uint8ClampedArray(array);
        var bounded = new ImageData(clampedArray, boundedCanvas.width, boundedCanvas.height);
        boundedCtx.putImageData(bounded, 0, 0);
        boundedCtx.beginPath();
        boundedCtx.lineWidth = '1';
        boundedCtx.strokeStyle = 'red';
        boundedCtx.rect(boundingRectangle.minX, boundingRectangle.minY, Math.abs(boundingRectangle.minX - boundingRectangle.maxX), Math.abs(boundingRectangle.minY - boundingRectangle.maxY));
        boundedCtx.stroke();
        // Vector that shifts an image to the center of the mass.
        var trans = this.centerImage(pixels); // [dX, dY] to center of mass
        // copy image to hidden canvas, translate to center-of-mass, then
        // scale to fit into a 200x200 box (see MNIST calibration notes on
        // Yann LeCun's website)
        var brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
        var brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
        // var scaling = (centeredCanvas.width / 2) / (brW > brH ? brW : brH);
        // //     var img = centeredCtx.createImageData(100, 100);
        // //     for (var i = img.data.length; --i >= 0; )
        // //       img.data[i] = 0;
        // //     centeredCtx.putImageData(img, 100, 100);
        // //     centeredCtx.setTransform(1, 0, 0, 1, 0, 0);
        //   // scale
        //   // centeredCtx.translate(centeredCanvas.width / 2, centeredCanvas.height/ 2);
        //   // centeredCtx.scale(scaling, scaling);
        //   // centeredCtx.translate(-centeredCanvas.width/2, -centeredCanvas.height/2);
        //   // translate to center of mass
        //   centeredCtx.translate(trans.transX, trans.transY);
        //   centeredCtx.clearRect(0, 0, centeredCanvas.width, centeredCanvas.height);
        //   centeredCtx.drawImage(originalCtx.canvas, 0, 0);
        //   // scaledCtx.clearRect(0, 0, scaledCanvas.width, scaledCanvas.height);
        //   // scaledCtx.drawImage(centeredCtx.canvas, 0, 0);
        // Get width and height of the bounding box of the segmented digit.
        var brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
        var brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
        // Set the scaling factor in a way that will uniformy decarease width and height of bounding box so that it fits 20x20pixel window
        var scalingFactor = 20 / Math.max(brW, brH);
        // var scaling = (centeredCanvas.width / 2) / (brW > brH ? brW : brH);
        // const scaleX = 20 /brW;
        // const scaleY= 20 / brH;
        // // scaledCtx.translate(scaledCtx.width / 2, scaledCtx.height / 2);
        // scaledCtx.scale(scaleX, scaleY);
        // // scaledCtx.translate(-scaledCtx.width/2, -scaledCtx.height /2);
        // scaledCtx.clearRect(0, 0, scaledCtx.width, scaledCtx.height);
        // scaledCtx.drawImage(originalCtx.canvas, 0, 0);
        // Reset the drawing.
        var img = mnistCtx.createImageData(100, 100);
        for (var i = img.data.length; --i >= 0;) {
            img.data[i] = 0;
        }
        mnistCtx.putImageData(img, 100, 100);
        // Reset the tranforms
        mnistCtx.setTransform(1, 0, 0, 1, 0, 0);
        // Clear the canvas.
        mnistCtx.clearRect(0, 0, mnistCanvas.width, mnistCanvas.height);
        // Ensure that 20x20 square that bound the digit is centered on 28x28 canvas.
        // mnistCtx.translate(4, 4);
        /**
         * This is just for demo and should be removed.
         * Drawing centered 20x20 rectrangle centerad at 28x28 canvas.
         */
        // mnistCtx.beginPath();
        // mnistCtx.lineWidth = '1';
        // mnistCtx.strokeStyle = 'green';
        // mnistCtx.rect(4, 4, 20, 20);
        // mnistCtx.stroke();
        // mnistCtx.scale(scalingFactor, scalingFactor);
        mnistCtx.translate(-brW * scalingFactor / 2, -brH * scalingFactor / 2);
        mnistCtx.translate(mnistCtx.canvas.width / 2, mnistCtx.canvas.height / 2);
        mnistCtx.translate(-Math.min(boundingRectangle.minX, boundingRectangle.maxX) * scalingFactor, -Math.min(boundingRectangle.minY, boundingRectangle.maxY) * scalingFactor);
        mnistCtx.scale(scalingFactor, scalingFactor);
        // mnistCtx.translate(scaledCtx.width / 2, scaledCtx.height / 2);
        // mnistCtx.scale(scaleX, scaleY);
        // mnistCtx.translate(-scaledCtx.width/2, -scaledCtx.height /2);
        // mnistCtx.clearRect(0, 0, 28, 28);
        mnistCtx.drawImage(originalCtx.canvas, 0, 0);
        // mnistCtx.rect(0, 0, 20, 20);
    };
    // Function takes grayscale image and finds bounding rectangle of digit defined by corresponding treshold.
    Atrament.prototype.getBoundingRectangle = function (img, threshold) {
        if (threshold === void 0) {
            threshold = 0.01;
        }
        var rows = img.length;
        var columns = img[0].length;
        var minX = columns;
        var minY = rows;
        var maxX = -1;
        var maxY = -1;
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                if (img[y][x] > 1 - threshold) {
                    if (minX > x)
                        minX = x;
                    if (maxX < x)
                        maxX = x;
                    if (minY > y)
                        minY = y;
                    if (maxY < y)
                        maxY = y;
                }
            }
        }
        return {minY: minY, minX: minX, maxY: maxY, maxX: maxX};
    };
    /**
     * Evaluates center of mass of digit, in order to center it.
     * Note that 1 stands for black and 0 for white so it has to be inverted.
     */
    Atrament.prototype.centerImage = function (img) {
        var meanX = 0, meanY = 0, rows = img.length, columns = img[0].length, pixel = 0, sumPixels = 0, y = 0, x = 0;
        for (y = 0; y < rows; y++) {
            for (x = 0; x < columns; x++) {
                // pixel = (1 - img[y][x]);
                pixel = img[y][x];
                sumPixels += pixel;
                meanY += y * pixel;
                meanX += x * pixel;
            }
        }
        meanX /= sumPixels;
        meanY /= sumPixels;
        var dY = Math.round(rows / 2 - meanY);
        var dX = Math.round(columns / 2 - meanX);
        return {transX: dX, transY: dY};
    };
    return Atrament;
}();
var sketcher = new Atrament('#original');

document.getElementById('submit').onclick = function (e) {
    e.preventDefault();
    var resultLabel = document.getElementById('result');
    var mnistCtx = document.getElementById('mnist').getContext('2d');
    var mnistimgData = mnistCtx.getImageData(0, 0, 28, 28);
    var mnistdata = mnistimgData.data;
    var mnistArrayOfPixels = [];
    for (var counter = 0; counter < 28 * 28; counter++) {
        mnistArrayOfPixels[counter] = mnistdata[counter * 4 + 3];
    }
    var url = '/guess';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var guess = xhr.responseText;
            console.log('guessed ' + guess);
            resultLabel.innerText = 'My guess is ' + guess + ' ! Am I right ?';
        }
    };
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    try {
        xhr.send(JSON.stringify({
            arrayOfPixels: mnistArrayOfPixels
        }));
    } catch (e) {
        console.error(e)
    }
};

function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}

document.getElementById('clear').onclick = function (e) {
    e.preventDefault();
    var canvas = document.getElementById('original');
    var ctx = canvas.getContext('2d');
    clearCanvas(ctx, canvas);
    document.getElementById('result').innerText = "";
};