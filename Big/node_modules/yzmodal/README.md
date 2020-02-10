1. Connect scripts:

```javascript

    app.use(express.static('node_modules/yzmodal'));
    app.use(express.static('node_modules/angular'));
    app.use(express.static('node_modules/angular-animate'));
    app.use(express.static('node_modules/angular-material'));
    app.use(express.static('node_modules/angular-messages'));
    app.use(express.static('node_modules/angular-aria'));


```
```html
    <script src="angular.js"></script>
    <script src="angular-animate.min.js"></script>
    <script src="angular-aria.min.js"></script>
    <script src="angular-messages.min.js"></script>
    <script src="angular-material.min.js"></script>
    
    <script src="yzModal.module.js"></script>
    <script src="yzModal.component.js"></script>

```
2. Declare dependencies in your app:

```javascript

    var tcApp = angular.module('tcApp', [
        'ngMaterial',
        'ngMessages',
        'yzModal'
    ]);

```

3. Use

```html

    <yz-modal header="popup1" btn-text="open popup1">
        <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias aliquid nesciunt doloremque
            expedita beatae, nihil asperiores voluptate perferendis incidunt sunt aspernatur, ad sequi
            necessitatibus iste suscipit culpa maxime hic temporibus!
        </p>
    </yz-modal>

    <yz-modal header='popup2' btn-text="open popup2">
        <div>
            <img src="img/work.jpg" alt="">
        </div>
    </yz-modal>

```