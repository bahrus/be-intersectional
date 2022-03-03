# be-intersectional

Materialize / Dematerialize template on demand.  Support for virtual lists.

## Syntax

```html
<style>
template[be-intersectional], template[is-intersectional]{
        display:block;
        height: 100px;
}
</style>
<template be-intersectional>
    <div>I am here</div>
</template>
```

be-intersectional will not work unless a style like shown above is specified.  Height should be the best estimate for how high the template will be when it is instantiated.

Specify options:

<template be-intersectional='{
    "options":{
        "threshold": 0.5,
        "rootMargin": "0px 0px -100px 0px"
    },
    "archive": true

}'>
    <div>I am here</div>
</template>

When scrolled out of view, content is deleted, but the original template is retained, so the content can materialize again when brought back into view.

Use Case II [TODO]

Add class when viewable

```html
<div be-intersectional=my-class>
</div>
```

