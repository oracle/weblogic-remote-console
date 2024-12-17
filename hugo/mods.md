A list of modifications made to the learn theme that weren't made in the config.toml file

## Left menu
By default, there are entries for 'Home' and 'Release Notes' in the left menu. These have been removed by commenting them out of the layout template in `hugo/themes/hugo-theme-learn/layouts/partials/menu.html`

## CSS changes

Main CSS file: `/hugo/../themes/hugo-theme-learn/static/css/theme.css`

There are other CSS files but this seems to be the main one.

### Block/inline images

By default, all images are rendered as block images. I removed the CSS styling so images are now inline by default, if they're within a paragraph.

If you want a block image, place the image code on a separate line, with empty lines before and after it, like so:

Some text.

![Image](/image.png)

More text.

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

### Notices styling

The default styling for notices wasn't flexible and if you added anything more exotic than a single p tag, the styling would break. Various changes were made to the `div.notices ...` rulesets (starting at ~ line 483) to allow for other elements like lists and codeblocks to render well inside notices. 

Typically, that meant replacing rulesets targeting `div.notices p` with ones that target any direct descendant: `div.notices > *`.


### Icon styling
Added styling to vertically align images that are inline (or inline-block) with text.

```
img[src*="/images/"] {
    vertical-align: text-bottom;
}
```

### Table head
Added border styling to `th`

From
```
th {
    background: #f7f7f7;
    padding: 0.5rem;
}
```
to 
```
th {
    background: #f7f7f7;
    padding: 0.5rem;
    border: 1px solid #eaeaea;
}
```

### Expand label and content

Adds styling to expand/collapse to [Expand Shortcode](https://learn.netlify.app/en/shortcodes/expand/)

```
div.expand-label {
    background-color: #f7f7f7;
    padding: 0.5rem;
}
div.expand-content {
    background-color: #f7f7f7;
    padding: 0.5rem 2rem;
    margin-top: 0.5rem;
}
```

## Fix inadvertent code blocks

CommonMark automatically processes any content that is indented 4 times as code and treats it accordingly when converting from Markdown to HTML, which can get annoying.

This change uses the [InnerDeindent](https://gohugo.io/methods/shortcode/innerdeindent/) Hugo method to fix the issue when it happens to notices that contain multiple block elements *and* the notice is itself inside another block element. 

Updates the notices shortcode to use `InnerDeindent` instead of `Inner` at`\themes\hugo-theme-learn\layouts\shortcodes\notice.html`

```
{{ $_hugo_config := `{ "version": 1 }` }}
<div class="notices {{ .Get 0 }}" {{ if len .Params | eq 2 }} id="{{ .Get 1 }}" {{ end }}>{{ .Inner }}</div>
```

becomes

```
{{ $_hugo_config := `{ "version": 1 }` }}
<div class="notices {{ .Get 0 }}" {{ if len .Params | eq 2 }} id="{{ .Get 1 }}" {{ end }}>{{ $opts := dict "display" "block" }}{{ .InnerDeindent | .Page.RenderString $opts }}</div>
```


