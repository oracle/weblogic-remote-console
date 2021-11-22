A list of modifications made to the learn theme that weren't made in the config.toml file

## Left menu
By default, there are entries for 'Home' and 'Release Notes' in the left menu. These have been removed by commenting them out of the layout template in `hugo/themes/hugo-theme-learn/layouts/partials/menu.html`

## Block/inline images

By default, all images are rendered as block images. I removed the CSS styling so images are now inline by default, if they're within a paragraph.

If you want a block image, place the image code on a separate line, with empty lines before and after it, like so:

Some text.

![Image](/image.png)

More text.

This change was made in `/hugo/themes/hugo-theme-learn/static/css/theme.css` at line 329.

```
#body img, #body .video-container {
    margin: 3rem auto;
    display: block;
    text-align: center;
}
```

became

```
#body .video-container {
    margin: 3rem auto;
    display: block;
    text-align: center;
}
```

i.e. `#body img,` was removed.

## Notices styling

The default styling for notices meant that anything more exotic than a (single) p tag and the styling would break down. This change allows for other elements like lists to render well inside notices.

Original (for div.notices.info, div.notices.warning, div.notices.note, and div.notices.tip ):
```
div.notices.info p {
    border-top: 30px solid #F0B37E;
    background: #FFF2DB;
}
```

New (for div.notices.info, div.notices.warning, div.notices.note, and div.notices.tip ):
```
div.notices.info p:first-of-type {
    border-top: 30px solid #F0B37E;
}
div.notices.info {
    background: #FFF2DB;
}
```