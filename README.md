# be-intersectional

Use Case I

Instantiate template when viewable.

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
    }

}'>
    <div>I am here</div>
</template>

Use Case II [TODO]

Add class when viewable

```html
<div be-intersectional=my-class>
</div>
```

