# be-intersectional

Materialize / Dematerialize template on demand.  Support for virtual lists.

[![Actions Status](https://github.com/bahrus/be-intersectional/workflows/CI/badge.svg)](https://github.com/bahrus/be-intersectional/actions?query=workflow%3ACI)

## Syntax

```html
<style>
template[be-intersectional], template[is-intersectional]{
        display:block;
        height: 19px;
}
</style>
<template be-intersectional>
    <div>I am here</div>
</template>
```

be-intersectional will not work unless a style like shown above is specified.  Height should be the best estimate for how high the template will be when it is instantiated.

Specify intersection observing options:

<template be-intersectional='{
    "options":{
        "threshold": 0.5,
        "rootMargin": "0px 0px -100px 0px"
    },
}'>
    <div>I am here</div>
</template>

When scrolled out of view, content is deleted, but the original template is retained, so the content can materialize again when brought back into view.



