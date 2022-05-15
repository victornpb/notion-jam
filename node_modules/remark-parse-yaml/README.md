# remark-parse-yaml
[![npm version](https://badge.fury.io/js/remark-parse-yaml.svg)](https://badge.fury.io/js/remark-parse-yaml) [![Build Status](https://travis-ci.org/landakram/remark-parse-yaml.svg?branch=master)](https://travis-ci.org/landakram/remark-parse-yaml)

This [remark](https://github.com/wooorm/remark) plugin takes markdown with yaml frontmatter and parses the yaml into an object.

## Usage

```javascript
const unified = require('unified')
const markdown = require('remark-parse')
const frontmatter = require('remark-frontmatter')
const parseFrontmatter = require('remark-parse-yaml');

let processor = unified()
    .use(markdown)
    .use(frontmatter)
    .use(parseFrontmatter)
```

When the processor is run, `yaml` nodes will now have an additional key, `parsedValue`, 
attached to its `data` key.

Say that we have this markdown string:

``` markdown
---
metadata: this is metadata
tags:
    - one
    - two
---

# Heading 
```

When parsed, this will produce a `yaml` node with a `data` object that looks like this:

```javascript
data: {
    parsedValue: {
        metadata: "this is metadata",
        tags: ["one", "two"]
    }
}
```
