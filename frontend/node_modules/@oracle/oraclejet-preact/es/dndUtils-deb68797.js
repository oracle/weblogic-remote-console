/* @oracle/oraclejet-preact: undefined */
import { c as classNames } from './classNames-4e12b00d.js';
import './DragAndDropStyles.styles.css';

var styles = {draggerPositionStyles:'DragAndDropStyles_draggerPositionStyles__ayaq500'};

/**
 * A helper function that returns the dragImage.
 */
const createDragImage = (dragTarget, dragImageClasses) => {
    const dragImage = dragTarget.cloneNode(true);
    dragImage.className = classNames([dragImageClasses, styles.draggerPositionStyles]);
    dragImage.style.width = dragTarget.offsetWidth + 'px';
    document.body.appendChild(dragImage);
    return dragImage;
};

export { createDragImage as c };
//# sourceMappingURL=dndUtils-deb68797.js.map
