tm.game.setup({
    title: "hamcorossam",
    startLabel: "game",
    assets: {
        image: "mat_069.gif",
    },
});

tm.define("GameScene", {
    superClass: "Scene",
    init: function() {
        this.superInit();

        var texture = tm.asset.Manager.get("image");
        var canvas = Canvas().resize(texture.width, texture.height);
        canvas.drawTexture(texture, 0, 0);

        var bm = canvas.getBitmap();

        var frameColor = [0, 0, 77, 255].toString();
        var textColor = [248, 248, 248, 255].toString();
        var textColor2 = [255, 255, 255, 255].toString();
        var bgColor = [0, 0, 255, 255].toString();

        var tops = [];
        var bottoms = [];

        for (var y = 0; y < bm.height - 1; y++) {
            for (var x = 0; x < bm.width - 1; x++) {
                var p0 = bm.getPixel(x + 0, y + 0);
                var p1 = bm.getPixel(x + 1, y + 0);
                var p2 = bm.getPixel(x + 0, y + 1);
                var p3 = bm.getPixel(x + 1, y + 1);

                if (p0.toString() === frameColor &&
                    p1.toString() === frameColor &&
                    p2.toString() === frameColor &&
                    p3.toString() !== frameColor && p3.toString() !== textColor && p3.toString() !== textColor2) {
                    // console.log("0 左上");

                    tops.push({
                        left: [x + 1, y + 1]
                    });

                } else if (p0.toString() === frameColor &&
                    p1.toString() === frameColor &&
                    p2.toString() !== frameColor && p2.toString() !== textColor && p2.toString() !== textColor2 &&
                    p3.toString() === frameColor) {
                    // console.log("1 右上");

                    var top = tops.last;
                    top.right = [x + 1, y + 1];

                } else if (p0.toString() === frameColor &&
                    p1.toString() !== frameColor && p1.toString() !== textColor && p1.toString() !== textColor2 &&
                    p2.toString() === frameColor &&
                    p3.toString() === frameColor) {
                    // console.log("2 左下");

                    bottoms.push({
                        left: [x + 1, y + 1]
                    });

                } else if (p0.toString() !== frameColor && p0.toString() !== textColor && p0.toString() !== textColor2 &&
                    p1.toString() === frameColor &&
                    p2.toString() === frameColor &&
                    p3.toString() === frameColor) {
                    // console.log("3 右下");

                    var bottom = bottoms.last;
                    bottom.right = [x + 1, y + 1];

                }
            }
        }

        var canvases = [];

        for (var i = 0; i < tops.length; i++) {
            var x = tops[i].left[0];
            var y = tops[i].left[1];
            var w = bottoms[i].right[0] - tops[i].left[0];
            var h = bottoms[i].left[1] - tops[i].left[1];

            var c = Canvas().resize(w, h);
            c.drawTexture(texture, x, y, w, h, 0, 0, w, h);
            canvases.push(c);
        }

        canvases.forEach(function(canvas) {
            this.toka(canvas);
        }.bind(this));

        var x = 0;
        var y = 0;
        canvases.forEach(function(canvas) {
            var sprite = Sprite(canvas)
                .setOrigin(0, 0)
                .setPosition(x, y)
                .addChildTo(this)
                .setInteractive(true)
                .setBoundingType("rect")
                .on("pointingend", function() {
                    canvas.saveAsImage();
                });

            x += sprite.width;
            if (x > SCREEN_WIDTH - sprite.width) {
                x = 0;
                y += sprite.height;
            }
        }.bind(this));
    },

    toka: function(canvas) {
        var blue = [0,0,255,255].toString();
        var bm = canvas.getBitmap();
        for (var y = 0; y < bm.height; y++) {
            for (var x = 0; x < bm.width; x++) {
                var p = bm.getPixel(x, y);
                if (p.toString() === blue) {
                    bm.setPixel32(x, y, 0, 0, 0, 0);
                }
            }
        }

        canvas.clear().drawBitmap(bm, 0, 0);
    },
});
