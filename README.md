# be-intersectional

Use Case I

Instantiate template when viewable.

## Syntax

```html
<template be-intersectional>
    <div>I am here</div>
</template>
```

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

