const Utils = {
    formatSize(height, width, maxHeight, maxWidth) {
        var widthScaling = 1;
        var heightScaling = 1;

        if (height > maxHeight) {
            heightScaling = (maxHeight / height)
        }
        else {
            heightScaling = 1
        }

        if (width > maxWidth) {
            widthScaling = (maxWidth / width);
        }
        else {
            widthScaling = 1
        }

        if (heightScaling > widthScaling) {
            return widthScaling;
        }
        else {
            return heightScaling;
        }
    }
}

export default Utils