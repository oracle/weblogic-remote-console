/* @oracle/oraclejet-preact: undefined */
'use strict';

var classNames = require('./classNames-c14c6ef3.js');


var styles = {draggerPositionStyles:'DragAndDropStyles_draggerPositionStyles__ayaq500'};

/**
 * A helper function that returns the dragImage.
 */
const createDragImage = (dragTarget, dragImageClasses) => {
    const dragImage = dragTarget.cloneNode(true);
    dragImage.className = classNames.classNames([dragImageClasses, styles.draggerPositionStyles]);
    dragImage.style.width = dragTarget.offsetWidth + 'px';
    document.body.appendChild(dragImage);
    return dragImage;
};

exports.createDragImage = createDragImage;
//# sourceMappingURL=dndUtils-21d97036.js.map
