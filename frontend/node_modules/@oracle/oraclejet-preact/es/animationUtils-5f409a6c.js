/* @oracle/oraclejet-preact: undefined */
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

export { ANCHOR_DEFAULT as A, SLIDE_UP_LARGE as B, SLIDE_DOWN_SMALL as C, DURATION_LARGE as D, EASING_ENTER as E, SLIDE_DOWN_MEDIUM as F, SLIDE_DOWN_LARGE as G, SLIDE_START_SMALL as H, SLIDE_START_MEDIUM as I, SLIDE_START_LARGE as J, SLIDE_START_XLARGE as K, SLIDE_END_SMALL as L, SLIDE_END_MEDIUM as M, SLIDE_END_LARGE as N, SLIDE_END_XLARGE as O, SCALE_DOWN_SMALL as P, SCALE_DOWN_MEDIUM as Q, SCALE_DOWN_FULL as R, SLIDE_UP_XLARGE as S, SCALE_UP_SMALL as T, SCALE_UP_MEDIUM as U, FADE_IN_SMALL as V, FADE_IN_FULL as W, FADE_OUT_SMALL as X, FADE_OUT_FULL as Y, SLIDE_DOWN_XLARGE as a, SCALE_UP_FULL as b, EASING_EXIT as c, EASING_PERSIST as d, EASING_LiNEAR as e, DURATION_XXSMALL as f, DURATION_XSMALL as g, DURATION_SMALL as h, DURATION_MEDIUM as i, DURATION_XLARGE as j, DURATION_XXLARGE as k, DELAY_NONE as l, mergeAnimationStateObjects as m, DELAY_SMALL as n, DELAY_MEDIUM as o, DELAY_LARGE as p, ANCHOR_TOP_LEFT as q, ANCHOR_TOP_CENTER as r, ANCHOR_TOP_RIGHT as s, ANCHOR_LEFT_CENTER as t, ANCHOR_RIGHT_CENTER as u, ANCHOR_BOTTOM_LEFT as v, ANCHOR_BOTTOM_CENTER as w, ANCHOR_BOTTOM_RIGHT as x, SLIDE_UP_SMALL as y, SLIDE_UP_MEDIUM as z };
//# sourceMappingURL=animationUtils-5f409a6c.js.map
