/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * This is a JavaScript module that leverages the JQuery API and custom events to fashion a rudimentary panel resizer.
 * <p>It has behavior that is similar to a "splitter", but lacks a lot of the features typically found in that type of component.</p>
 */
define(['jquery'],
  function($) {
    let count = 0, resizers = [];
    let resizer_id = null, current_resizer = null, current_resizer_index = null;

    $.fn.split = function(options) {
      let data = this.data('resizer');
      if (data) return data;

      let panels = [], $resizers = [];
      let panelLeft, panelRight;

      let settings = $.extend({
        limit: 100,
        position: '50%',
        onDragStart: $.noop,
        onDragEnd: $.noop,
        onDrag: $.noop
      }, options || {});

      this.settings = settings;

      function addPanels(children) {
        let classList;
        if (children.length === 2) {
          panelLeft = children.first().addClass('left_panel');
          panelRight = panelLeft.next().addClass('right_panel');
          classList = 'vertical-gripper';
          panels = [panelLeft, panelRight];
        }
        else {
          children.each(() => {
            var panel = $(this);
            panel.addClass('vertical_panel');
            classList = 'vertical-gripper';
            panels.push(panel);
          });
        }

        return classList;
      }

      function addResizers(classList) {
        let id = count++;

        panels.slice(0, -1).forEach((panel, i) => {
          const resizer = $('<div/>').addClass(classList).on('mouseenter', function() {
            resizer_id = id;
            current_resizer_index = resizer.index() - i - 1;
          }).on('mouseleave', () => {
            resizer_id = null;
            current_resizer_index = null;
          }).insertAfter(panel);
          $resizers.push(resizer);
        });

        return id;
      }

      this.addClass('resizer_panel');

      const classList = addPanels(this.children());
      let id = addResizers(classList);

      let width = this.width();
      let height = this.height();
      let position;

      function get_position(position) {
        if (position instanceof Array) {
          return position.map(get_position);
        }
        if (typeof position === 'number') {
          return position;
        }
        if (typeof position === 'string') {
          const match = position.match(/^([0-9.]+)(px|%)$/);
          if (match) {
            if (match[2] === 'px') {
              return +match[1];
            }
            else {
              return (width * +match[1]) / 100;
            }
          }
          else {
            //throw position + ' is invalid value';
          }
        }
        else {
          //throw 'position have invalid type';
        }
      }

      function set_limit(limit) {
        if(!isNaN(parseFloat(limit)) && isFinite(limit)){
          return {
            leftUpper: limit,
            rightBottom: limit
          };
        }
        return limit;
      }

      var self = $.extend(this, {
        refresh: function() {
          var new_width = this.width();
          var new_height = this.height();
          if (width !== new_width || height !== new_height) {
            width = this.width();
            height = this.height();
            self.position(position);
          }
        },

        option: function(name, value) {
          if (name === 'position') {
            return self.position(value);
          } else if (typeof value === 'undefined') {
            return settings[name];
          } else {
            settings[name] = value;
          }
          return self;
        },

        position: (function() {
          function createGripper(dim_name, pos_name) {
            return (n, silent) => {
              if (n === undefined) {
                return position;
              } else {
                position = get_position(n);
                if (!(position instanceof Array)) {
                  position = [position];
                }
                if (position.length !== panels.length - 1) {
                  throw new Error('position array need to equal resizers length');
                }
                var outer_name = 'outer';
                outer_name += dim_name[0].toUpperCase() + dim_name.substring(1);
                var dim_px = self.css('visiblity', 'hidden')[dim_name]();
                var pw = 0;
                var sw_sum = 0;
                for (var i = 0; i < position.length; ++i) {
                  var resizer = $resizers[i];
                  var panel = panels[i];
                  var pos = position[i];
                  var resizer_dim = resizer[dim_name]();
                  var sw2 = resizer_dim/2;
                  panel.css(pos_name, pw + sw_sum);
                  pw += panel.css(dim_name, pos - sw2)[outer_name]();
                  resizer.css(pos_name, pw + sw_sum);
                  sw_sum += resizer_dim;
                }
                var panel_last = panels[i];
                var s_sum = resizer_dim * i;
                var props = {};
                props[dim_name] = dim_px - pw - sw_sum;
                props[pos_name] = pw + sw_sum;
                panel_last.css(props);
                self.css('visiblity', '');
              }
              if (!silent) {
                self.trigger('resizer.resize');
                self.find('.resizer_panel').trigger('resizer.resize');
              }
              return self;
            };
          }
          return createGripper('width', 'left');
        })(),

        _resizers: $resizers,
        _panels: panels,
        limit: set_limit(settings.limit),
        isActive: function() {
          return resizer_id === id;
        },

        destroy: function() {
          function clearResizers(resizers) {
            let not_null = false;
            for (var i = resizers.length; i--;) {
              if (resizers[i] !== null) {
                not_null = true;
                break;
              }
            }
            return not_null;
          }

          self.removeClass('resizer_panel');
          panelLeft.removeClass('left_panel');
          panelRight.removeClass('right_panel');
          self.off('resizer.resize');
          self.trigger('resizer.resize');
          self.find('.resizer_panel').trigger('resizer.resize');
          resizers[id] = null;
          count--;
          $resizers.each(() => {
            let resizer = $(this);
            resizer.off('mouseenter');
            resizer.off('mouseleave');
            resizer.remove();
          });
          self.removeData('resizer');
          const not_null = clearResizers(resizers);
          if (!not_null) {
            //remove document events when no resizers
            $(document.documentElement).off('.resizer');
            $(window).off('resize.resizer');
            resizers = [];
            count = 0;
          }
        }
      }); // end of self variable assignment

      self.on('resizer.resize', (event) => {
        let pos1 = self.position();
        if (pos1 > self.width()) {
          pos1 = self.width() - self.limit.rightBottom-1;
        }
        if (pos1 < self.limit.leftUpper) {
          pos1 = self.limit.leftUpper + 1;
        }
        event.stopPropagation();
        self.position(pos1, true);
      });

      var pos;
      if (pos > width - settings.limit.rightBottom) {
        pos = width - settings.limit.rightBottom;
      }
      else {
        pos = get_position(settings.position);
      }

      if (pos < settings.limit.leftUpper) {
        pos = settings.limit.leftUpper;
      }

      self.position(pos, true);

      const parent = this.closest('.resizer_panel');
      if (parent.length) {
        this.height(parent.height());
      }

      function calculateResizerPosition(pos, x) {
        let new_pos = pos.slice(0, current_resizer.index);
        let p;
        if (new_pos.length) {
          p = x - new_pos.reduce((a, b) => {
            return a + b;
          });
        } else {
          p = x;
        }
        const diff = pos[current_resizer.index] - p;
        new_pos.push(p);
        if (current_resizer.index < pos.length - 1) {
          let rest = pos.slice(current_resizer.index + 1);
          rest[0] += diff;
          new_pos = new_pos.concat(rest);
        }
        return new_pos;
      }

      if (resizers.filter(Boolean).length === 0) {
        $(window)
        .on('resize.resizer', () => {
          $.each(resizers, (i, resizer) => {
            if (resizer) {
              resizer.refresh();
            }
          });
        });

        $(document.documentElement)
        .on('mousedown.resizer', (event) => {
          if (resizer_id !== null) {
            event.preventDefault();
            current_resizer = {
              node: resizers[resizer_id],
              index: current_resizer_index
            };
            current_resizer.node.settings.onDragStart(event);
          }
        })
        .on('mouseup.resizer', (event) => {
          if (current_resizer) {
            current_resizer.node.settings.onDragEnd(event);
            current_resizer = null;
          }
        })
        .on('mousemove.resizer', (event) => {
          if (current_resizer !== null) {
            const node = current_resizer.node;
            const leftUpperLimit = node.limit.leftUpper;
            const rightBottomLimit = node.limit.rightBottom;
            const offset = node.offset();

            let pageX = event.pageX;
            if (event.originalEvent && event.originalEvent.changedTouches){
              pageX = event.originalEvent.changedTouches[0].pageX;
            }

            let x = pageX - offset.left;
            if (x <= node.limit.leftUpper) {
              x = node.limit.leftUpper + 1;
            } else if (x >= node.width() - rightBottomLimit) {
              x = node.width() - rightBottomLimit - 1;
            }

            const pos1 = node.position();
            if (pos1.length > 1) {
              node.position(calculateResizerPosition(pos1, x), true);
            }
            else if (x > node.limit.leftUpper && x < node.width() - rightBottomLimit) {
              node.position(x, true);
              node.trigger('resizer.resize');
              node.find('.resizer_panel').
              trigger('resizer.resize');
              //e.preventDefault();
            }
            node.settings.onDrag(event);
          }
        });
      }

      resizers[id] = self;
      self.data('resizer', self);

      return self;
    };
  }
);
