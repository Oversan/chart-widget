## Install packages
```
npm i
```

## Start example page with wigets
```
npm start
```

http://localhost:8080/


## Build widget
```
npm run build
```

## Build developer version of widget
```
npm run build:dev
```

## Connection Widget example

```js
import React from 'react'
import { render } from 'react-dom'
import Widget from './Widget'

const Root = () =>
  <div>
    <Widget type="genders" width="340" height="300" />
    <Widget type="deviceOsVersions" width="340" height="300">Widget Text 2</Widget>
    <Widget type="ageRanges">Widget Text 3</Widget>
  </div>


render(
  <Root />,
  document.getElementById('root')
)
```

## Developed with
- Nodejs 4.9.1
- Webpack

## Production dependencies
- ReactJs
- CssModules
- postcss-autoreset (Full css isolation for components)
- highcharts
