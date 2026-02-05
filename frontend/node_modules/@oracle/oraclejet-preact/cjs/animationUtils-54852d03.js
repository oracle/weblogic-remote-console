/* @oracle/oraclejet-preact: undefined */
'use strict';

const EASING_ENTER = [0, 0, 0.2, 1];
const EASING_PERSIST = [0.4, 0, 0.2, 1];
const EASING_EXIT = [0.4, 0, 1, 1];
const EASING_LiNEAR = [0, 0, 0, 0];
// Duration
const DURATION_XXSMALL = 25;
const DURATION_XSMALL = 50;
const DURATION_SMALL = 100;
const DURATION_MEDIUM = 150;
const DURATION_LARGE = 250;
const DURATION_XLARGE = 300;
const DURATION_XXLARGE = 500;
//DELAY
const DELAY_NONE = 0;
const DELAY_SMALL = 20;
const DELAY_MEDIUM = 30;
const DELAY_LARGE = 50;
const ANCHOR_DEFAULT = 'center';
const ANCHOR_TOP_LEFT = 'top left';
const ANCHOR_TOP_CENTER = 'top center';
const ANCHOR_TOP_RIGHT = 'top right';
const ANCHOR_LEFT_CENTER = 'left center';
const ANCHOR_RIGHT_CENTER = 'right center';
const ANCHOR_BOTTOM_LEFT = 'bottom left';
const ANCHOR_BOTTOM_CENTER = 'bottom center';
const ANCHOR_BOTTOM_RIGHT = 'bottom right';
// Fade
const FADE_IN_SMALL = {
    from: {
        opacity: 0.6
    },
    to: {
        opacity: 1
    }
};
const FADE_IN_FULL = {
    from: {
        opacity: 0
    },
    to: {
        opacity: 1
    }
};
const FADE_OUT_SMALL = {
    from: {
        opacity: 1
    },
    to: {
        opacity: 0.6
    }
};
const FADE_OUT_FULL = {
    from: {
        opacity: 1
    },
    to: {
        opacity: 0
    }
};
// Scale
const SCALE_DOWN_SMALL = {
    from: {
        scaleX: 1,
        scaleY: 1
    },
    to: {
        scaleX: 0.9,
        scaleY: 0.9
    }
};
const SCALE_DOWN_MEDIUM = {
    from: {
        scaleX: 1,
        scaleY: 1
    },
    to: {
        scaleX: 0.7,
        scaleY: 0.7
    }
};
const SCALE_DOWN_FULL = {
    from: {
        scaleX: 1,
        scaleY: 1
    },
    to: {
        scaleX: 0,
        scaleY: 0
    }
};
const SCALE_UP_SMALL = {
    from: {
        scaleX: 0.9,
        scaleY: 0.9
    },
    to: {
        scaleX: 1,
        scaleY: 1
    }
};
const SCALE_UP_MEDIUM = {
    from: {
        scaleX: 0.7,
        scaleY: 0.7
    },
    to: {
        scaleX: 1,
        scaleY: 1
    }
};
const SCALE_UP_FULL = {
    from: {
        scaleX: 0,
        scaleY: 0
    },
    to: {
        scaleX: 1,
        scaleY: 1
    }
};
// Slide
const SLIDE_UP_SMALL = {
    from: {
        translateY: `25%`
    },
    to: {
        translateY: '0'
    }
};
const SLIDE_UP_MEDIUM = {
    from: {
        translateY: `50%`
    },
    to: {
        translateY: '0'
    }
};
const SLIDE_UP_LARGE = {
    from: {
        translateY: `75%`
    },
    to: {
        translateY: '0'
    }
};
const SLIDE_UP_XLARGE = {
    from: {
        translateY: `100%`
    },
    to: {
        translateY: '0'
    }
};
const SLIDE_DOWN_SMALL = {
    from: {
        translateY: '0'
    },
    to: {
        translateY: `25%`
    }
};
const SLIDE_DOWN_MEDIUM = {
    from: {
        translateY: '0'
    },
    to: {
        translateY: `50%`
    }
};
const SLIDE_DOWN_LARGE = {
    from: {
        translateY: '0'
    },
    to: {
        translateY: `75%`
    }
};
const SLIDE_DOWN_XLARGE = {
    from: {
        translateY: '0'
    },
    to: {
        translateY: `100%`
    }
};
const SLIDE_START_SMALL = {
    from: {
        translateX: `25%`
    },
    to: {
        translateX: '0'
    }
};
const SLIDE_START_MEDIUM = {
    from: {
        translateX: `50%`
    },
    to: {
        translateX: '0'
    }
};
const SLIDE_START_LARGE = {
    from: {
        translateX: `75%`
    },
    to: {
        translateX: '0'
    }
};
const SLIDE_START_XLARGE = {
    from: {
        translateX: `100%`
    },
    to: {
        translateX: '0'
    }
};
const SLIDE_END_SMALL = {
    from: {
        translateY: '0'
    },
    to: {
        translateY: `25%`
    }
};
const SLIDE_END_MEDIUM = {
    from: {
        translateX: '0'
    },
    to: {
        translateX: `50%`
    }
};
const SLIDE_END_LARGE = {
    from: {
        translateX: '0'
    },
    to: {
        translateX: `75%`
    }
};
const SLIDE_END_XLARGE = {
    from: {
        translateX: '0'
    },
    to: {
        translateX: `100%`
    }
};
/**
 * Take multiple animation configurations and merge them to create a single one. If options param is passed
 * it overides values passes via that parameter.
 *
 * @param effects
 * @param options
 * @returns Animation configuration
 */
function mergeAnimationStateObjects(effects, options) {
    let animationConfig = {
        from: {},
        to: {},
        end: {},
        options: {}
    };
    effects.forEach((effect) => {
        animationConfig = {
            from: {
                ...animationConfig.from,
                ...effect.from
            },
            to: {
                ...animationConfig.to,
                ...effect.to
            },
            end: {
                ...animationConfig.end,
                ...effect.end
            },
            options: {
                ...animationConfig.options,
                ...effect.options
            }
        };
    });
    const { options: animationConfigOptions, ...fromToEnd } = animationConfig;
    return { ...fromToEnd, options: { ...animationConfigOptions, ...options } };
}

exports.ANCHOR_BOTTOM_CENTER = ANCHOR_BOTTOM_CENTER;
exports.ANCHOR_BOTTOM_LEFT = ANCHOR_BOTTOM_LEFT;
exports.ANCHOR_BOTTOM_RIGHT = ANCHOR_BOTTOM_RIGHT;
exports.ANCHOR_DEFAULT = ANCHOR_DEFAULT;
exports.ANCHOR_LEFT_CENTER = ANCHOR_LEFT_CENTER;
exports.ANCHOR_RIGHT_CENTER = ANCHOR_RIGHT_CENTER;
exports.ANCHOR_TOP_CENTER = ANCHOR_TOP_CENTER;
exports.ANCHOR_TOP_LEFT = ANCHOR_TOP_LEFT;
exports.ANCHOR_TOP_RIGHT = ANCHOR_TOP_RIGHT;
exports.DELAY_LARGE = DELAY_LARGE;
exports.DELAY_MEDIUM = DELAY_MEDIUM;
exports.DELAY_NONE = DELAY_NONE;
exports.DELAY_SMALL = DELAY_SMALL;
exports.DURATION_LARGE = DURATION_LARGE;
exports.DURATION_MEDIUM = DURATION_MEDIUM;
exports.DURATION_SMALL = DURATION_SMALL;
exports.DURATION_XLARGE = DURATION_XLARGE;
exports.DURATION_XSMALL = DURATION_XSMALL;
exports.DURATION_XXLARGE = DURATION_XXLARGE;
exports.DURATION_XXSMALL = DURATION_XXSMALL;
exports.EASING_ENTER = EASING_ENTER;
exports.EASING_EXIT = EASING_EXIT;
exports.EASING_LiNEAR = EASING_LiNEAR;
exports.EASING_PERSIST = EASING_PERSIST;
exports.FADE_IN_FULL = FADE_IN_FULL;
exports.FADE_IN_SMALL = FADE_IN_SMALL;
exports.FADE_OUT_FULL = FADE_OUT_FULL;
exports.FADE_OUT_SMALL = FADE_OUT_SMALL;
exports.SCALE_DOWN_FULL = SCALE_DOWN_FULL;
exports.SCALE_DOWN_MEDIUM = SCALE_DOWN_MEDIUM;
exports.SCALE_DOWN_SMALL = SCALE_DOWN_SMALL;
exports.SCALE_UP_FULL = SCALE_UP_FULL;
exports.SCALE_UP_MEDIUM = SCALE_UP_MEDIUM;
exports.SCALE_UP_SMALL = SCALE_UP_SMALL;
exports.SLIDE_DOWN_LARGE = SLIDE_DOWN_LARGE;
exports.SLIDE_DOWN_MEDIUM = SLIDE_DOWN_MEDIUM;
exports.SLIDE_DOWN_SMALL = SLIDE_DOWN_SMALL;
exports.SLIDE_DOWN_XLARGE = SLIDE_DOWN_XLARGE;
exports.SLIDE_END_LARGE = SLIDE_END_LARGE;
exports.SLIDE_END_MEDIUM = SLIDE_END_MEDIUM;
exports.SLIDE_END_SMALL = SLIDE_END_SMALL;
exports.SLIDE_END_XLARGE = SLIDE_END_XLARGE;
exports.SLIDE_START_LARGE = SLIDE_START_LARGE;
exports.SLIDE_START_MEDIUM = SLIDE_START_MEDIUM;
exports.SLIDE_START_SMALL = SLIDE_START_SMALL;
exports.SLIDE_START_XLARGE = SLIDE_START_XLARGE;
exports.SLIDE_UP_LARGE = SLIDE_UP_LARGE;
exports.SLIDE_UP_MEDIUM = SLIDE_UP_MEDIUM;
exports.SLIDE_UP_SMALL = SLIDE_UP_SMALL;
exports.SLIDE_UP_XLARGE = SLIDE_UP_XLARGE;
exports.mergeAnimationStateObjects = mergeAnimationStateObjects;
//# sourceMappingURL=animationUtils-54852d03.js.map
